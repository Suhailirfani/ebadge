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
        verbose_name="رمز التسجيل"
    )
    full_name = models.CharField(max_length=150, verbose_name="الاسم الكامل")
    role = models.CharField(max_length=50, default="متعلّمة", verbose_name="الصفة")
    batch = models.CharField(max_length=100, blank=True, verbose_name="الدفعة")
    year = models.CharField(max_length=20, default="٢٠٢٦", verbose_name="السنة")
    class_name = models.CharField(max_length=100, blank=True, verbose_name="الصف")
    course = models.CharField(max_length=150, blank=True, verbose_name="الدورة")
    
    photo = models.ImageField(upload_to="participant_photos/", blank=True, null=True, verbose_name="الصورة الشخصية")
    badge_image = models.ImageField(upload_to="badges/", blank=True, null=True, verbose_name="صورة البطاقة")
    qr_code_image = models.ImageField(upload_to="qr_codes/", blank=True, null=True, verbose_name="رمز QR")
    
    is_verified = models.BooleanField(default=False, verbose_name="تم الحضور / التحقق")
    verified_at = models.DateTimeField(blank=True, null=True, verbose_name="وقت التحقق")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ التسجيل")

    class Meta:
        verbose_name = "مشاركة"
        verbose_name_plural = "المشاركات"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.registration_code})"

    def save(self, *args, **kwargs):
        if not self.registration_code:
            self.registration_code = generate_unique_code()
        
        super().save(*args, **kwargs)
        
        if not self.qr_code_image:
            self.generate_qr_code()

    def generate_qr_code(self):
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
