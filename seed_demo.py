import os
import sys
import django

sys.stdout.reconfigure(encoding='utf-8')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ebadge_project.settings')
django.setup()

from badge_app.models import Participant

demos = [
    {
        "registration_code": "UHV-DEMO2026",
        "full_name": "عَائِقَة حَبِيبَة",
        "role": "متعلّمة",
        "batch": "الدفعة الأولى",
        "year": "٢٠٢٦",
        "class_name": "الصف العاشر",
        "course": "الدراسات الإسلامية",
        "is_verified": False
    },
    {
        "registration_code": "UHV-7F6A5A",
        "full_name": "مَرْيَم عَبْدُ الله",
        "role": "خريجة",
        "batch": "الدفعة الثانية",
        "year": "٢٠٢٦",
        "class_name": "الصف الثاني عشر",
        "course": "علوم القرآن الكريم",
        "is_verified": False
    },
    {
        "registration_code": "UHV-1DE9B6",
        "full_name": "فَاطِمَة الزَّهْرَاء",
        "role": "معلّمة",
        "batch": "الكادر التعليمي",
        "year": "٢٠٢٦",
        "class_name": "قسم اللغة العربية",
        "course": "البلاغة والإعجاز القرآنية",
        "is_verified": True
    }
]

for d in demos:
    p, created = Participant.objects.get_or_create(
        registration_code=d["registration_code"],
        defaults=d
    )
    if created:
        print(f"Created participant: {p.full_name} ({p.registration_code})")
    else:
        print(f"Already exists: {p.full_name} ({p.registration_code})")

print("Demo seed complete!")
