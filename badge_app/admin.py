from django.contrib import admin
from .models import Participant

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('registration_code', 'full_name', 'role', 'batch', 'class_name', 'course', 'is_verified', 'created_at')
    list_filter = ('role', 'is_verified', 'batch', 'year')
    search_fields = ('registration_code', 'full_name', 'course', 'class_name')
    readonly_fields = ('registration_code', 'created_at', 'verified_at')
