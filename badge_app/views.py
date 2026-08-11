import re
import csv
import json
import base64
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.db import models
from .models import Participant

def index_view(request):
    """Registration & Live Badge Generator Page"""
    return render(request, 'badge_app/index.html')

def data_table_view(request):
    """Admin Data Table Page for viewing applicants"""
    query = request.GET.get('q', '').strip()
    batch_filter = request.GET.get('batch', '').strip()
    status_filter = request.GET.get('status', '').strip()
    
    participants = Participant.objects.all()
    
    if query:
        participants = participants.filter(
            models.Q(full_name__icontains=query) |
            models.Q(registration_code__icontains=query) |
            models.Q(course__icontains=query) |
            models.Q(class_name__icontains=query)
        )
    if batch_filter:
        participants = participants.filter(batch=batch_filter)
    if status_filter == 'verified':
        participants = participants.filter(is_verified=True)
    elif status_filter == 'unverified':
        participants = participants.filter(is_verified=False)

    batches = Participant.objects.values_list('batch', flat=True).distinct()
    
    context = {
        'participants': participants,
        'query': query,
        'batch_filter': batch_filter,
        'status_filter': status_filter,
        'batches': filter(None, batches),
        'total_count': Participant.objects.count(),
        'verified_count': Participant.objects.filter(is_verified=True).count(),
        'unverified_count': Participant.objects.filter(is_verified=False).count(),
    }
    return render(request, 'badge_app/data_table.html', context)

def scanner_view(request):
    """Admin QR Scanner Page"""
    return render(request, 'badge_app/scanner.html')

def participant_detail_view(request, code):
    """Public verification page when QR code is scanned"""
    # Robust matching for case or demo code
    participant = Participant.objects.filter(registration_code__iexact=code.strip()).first()
    if not participant:
        participant = get_object_or_404(Participant, registration_code=code)
    return render(request, 'badge_app/verify_detail.html', {'participant': participant})

@csrf_exempt
def register_participant_api(request):
    """API endpoint to create or update a participant and store images"""
    if request.method == 'POST':
        try:
            full_name = request.POST.get('full_name', '').strip()
            role = request.POST.get('role', 'متعلّمة').strip()
            batch = request.POST.get('batch', '').strip()
            year = request.POST.get('year', '٢٠٢٦').strip()
            class_name = request.POST.get('class_name', '').strip()
            course = request.POST.get('course', '').strip()
            existing_code = request.POST.get('registration_code', '').strip()
            
            if not full_name:
                return JsonResponse({'success': False, 'error': 'Full Name is required.'}, status=400)
            
            if existing_code:
                participant = Participant.objects.filter(registration_code=existing_code).first()
            else:
                participant = None

            if not participant:
                participant = Participant.objects.create(
                    full_name=full_name,
                    role=role,
                    batch=batch,
                    year=year,
                    class_name=class_name,
                    course=course,
                )
            else:
                participant.full_name = full_name
                participant.role = role
                participant.batch = batch
                participant.year = year
                participant.class_name = class_name
                participant.course = course
            
            # Save uploaded/cropped photo if provided
            if 'photo' in request.FILES:
                participant.photo = request.FILES['photo']
            
            # Save generated badge base64 image if sent from canvas
            badge_b64 = request.POST.get('badge_b64', '')
            if badge_b64 and 'base64,' in badge_b64:
                format_str, imgstr = badge_b64.split(';base64,')
                ext = format_str.split('/')[-1]
                data = ContentFile(base64.b64decode(imgstr), name=f"badge_{participant.registration_code}.{ext}")
                participant.badge_image = data
                
            participant.save()
            
            return JsonResponse({
                'success': True,
                'registration_code': participant.registration_code,
                'id': participant.id,
                'full_name': participant.full_name,
                'qr_url': participant.qr_code_image.url if participant.qr_code_image else '',
                'badge_url': participant.badge_image.url if participant.badge_image else '',
                'verify_url': request.build_absolute_uri(f"/verify/{participant.registration_code}/")
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': f"Failed to register participant: {str(e)}"}, status=500)
            
    return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)

@csrf_exempt
def verify_qr_api(request):
    """API endpoint for Admin QR Scanner to verify participant code"""
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            raw_code = body.get('code', '').strip()
            
            # Extract UHV-XXXXXX pattern from any scanned string or URL
            match = re.search(r'UHV-[A-Z0-9]{4,10}', raw_code, re.IGNORECASE)
            if match:
                code = match.group(0).upper()
            else:
                code = raw_code.upper()
                
            participant = Participant.objects.filter(registration_code__iexact=code).first()

            if not participant:
                return JsonResponse({'success': False, 'error': f'Registration Code "{code}" is invalid or not registered in the database.'}, status=404)
            
            # Mark as verified
            participant.is_verified = True
            participant.verified_at = timezone.now()
            participant.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Participant verified successfully.',
                'participant': {
                    'code': participant.registration_code,
                    'full_name': participant.full_name,
                    'role': participant.role,
                    'batch': participant.batch,
                    'year': participant.year,
                    'class_name': participant.class_name,
                    'course': participant.course,
                    'verified_at': participant.verified_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'photo_url': participant.photo.url if participant.photo else '',
                    'badge_url': participant.badge_image.url if participant.badge_image else '',
                }
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': f"Verification error: {str(e)}"}, status=500)
            
    return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)

def export_csv_view(request):
    """Export participants list to UTF-8 Arabic CSV"""
    response = HttpResponse(content_type='text/csv; charset=utf-8-sig')
    response['Content-Disposition'] = 'attachment; filename="participants_list.csv"'
    
    response.write('\ufeff')
    writer = csv.writer(response)
    writer.writerow(['Reg. Code', 'Full Name', 'Role', 'Batch', 'Year', 'Class Grade', 'Course', 'Check-in Status', 'Date Registered'])
    
    for p in Participant.objects.all():
        writer.writerow([
            p.registration_code,
            p.full_name,
            p.role,
            p.batch,
            p.year,
            p.class_name,
            p.course,
            'Verified' if p.is_verified else 'Pending',
            p.created_at.strftime('%Y-%m-%d %H:%M')
        ])
    return response

@csrf_exempt
def delete_participant_api(request, pk):
    """Delete applicant record"""
    if request.method in ['POST', 'DELETE']:
        participant = get_object_or_404(Participant, pk=pk)
        participant.delete()
        return JsonResponse({'success': True, 'message': 'Participant deleted successfully.'})
    return JsonResponse({'success': False, 'error': 'Method not allowed.'}, status=405)
