import uuid
import qrcode
from io import BytesIO
from django.db import models
from django.core.files.base import ContentFile

def generate_unique_code():
    return f"UHV-{uuid.uuid4().hex[:6].upper()}"

class Participant(models.Model):
    registration_code = models.CharField(
        max_length=20, 
        unique=True, 
        default=generate_unique_code,
        verbose_name="Registration Code"
    )
    full_name = models.CharField(max_length=150, verbose_name="Full Name")
    role = models.CharField(max_length=50, default="متعلّمة", verbose_name="Role / Tag")
    batch = models.CharField(max_length=100, blank=True, verbose_name="Batch")
    year = models.CharField(max_length=20, default="٢٠٢٦", verbose_name="Year")
    class_name = models.CharField(max_length=100, blank=True, verbose_name="Class Grade")
    course = models.CharField(max_length=150, blank=True, verbose_name="Course")
    
    photo = models.ImageField(upload_to="participant_photos/", blank=True, null=True, verbose_name="Profile Photo")
    badge_image = models.ImageField(upload_to="badges/", blank=True, null=True, verbose_name="Badge Image")
    qr_code_image = models.ImageField(upload_to="qr_codes/", blank=True, null=True, verbose_name="QR Code Image")
    
    is_verified = models.BooleanField(default=False, verbose_name="Attendance Verified")
    verified_at = models.DateTimeField(blank=True, null=True, verbose_name="Verification Timestamp")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Registration Date")

    class Meta:
        verbose_name = "Participant"
        verbose_name_plural = "Participants"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.registration_code})"

    def save(self, *args, **kwargs):
        if not self.registration_code:
            self.registration_code = generate_unique_code()
        
        super().save(*args, **kwargs)
        
        # Generate QR Code image if missing
        if not self.qr_code_image:
            self.generate_qr_code()

    def generate_qr_code(self):
        try:
            qr_data = self.registration_code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=2,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            
            file_name = f"qr_{self.registration_code}.png"
            self.qr_code_image.save(file_name, ContentFile(buffer.getvalue()), save=False)
            super().save(update_fields=['qr_code_image'])
        except Exception as e:
            print(f"Error generating QR code in model: {e}")
