/**
 * E-Badge High-DPI Canvas Rendering Engine
 * UMMU HABEEBA VIRTUAL CAMPUS - Graduation 2026
 */

class BadgeCanvasEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // High DPI resolution for crisp printing (1080 x 1920)
        this.width = 1080;
        this.height = 1920;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.data = {
            fullName: 'عَائِقَة حَبِيبَة',
            role: 'متعلّمة',
            batch: 'الدفعة الأولى',
            year: '٢٠٢٦',
            className: 'الصف العاشر',
            course: 'الدراسات الإسلامية',
            qrCodeImg: null,
            photoImg: null,
            useArabicDigits: true
        };

        // Cache font loading status
        this.fontsLoaded = false;
        this.loadFonts();
    }

    async loadFonts() {
        try {
            await document.fonts.load('800 32px Cairo');
            await document.fonts.load('700 28px Amiri');
            this.fontsLoaded = true;
            this.render();
        } catch (e) {
            console.warn('Fonts loading fallback:', e);
            this.fontsLoaded = true;
            this.render();
        }
    }

    toArabicDigits(str) {
        if (!str) return '';
        if (!this.data.useArabicDigits) return str;
        const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        let result = str.toString();
        for (let i = 0; i < 10; i++) {
            result = result.replace(new RegExp(englishDigits[i], 'g'), arabicDigits[i]);
        }
        return result;
    }

    updateData(newData) {
        this.data = { ...this.data, ...newData };
        this.render();
    }

    setPhoto(imageElement) {
        this.data.photoImg = imageElement;
        this.render();
    }

    setQRCode(imageElement) {
        this.data.qrCodeImg = imageElement;
        this.render();
    }

    render() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.clearRect(0, 0, w, h);

        // 1. Background Fill
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#FAF7F0');
        bgGrad.addColorStop(1, '#FFFDF9');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Geometric Shapes (Side Hexagons & Circles)
        this.drawGeometricAccents(ctx, w, h);

        // 3. Top Yellow Header Arch Banner
        this.drawHeaderBanner(ctx, w);

        // 4. Central Hexagonal Photo Frame
        this.drawPhotoHexagon(ctx, w, 680, 240);

        // 5. Participant Name & Role Tag
        this.drawParticipantIdentity(ctx, w, 1040);

        // 6. Metadata Fields with Dotted Lines
        this.drawDetailsList(ctx, w, 1220);

        // 7. QR Code Box (Bottom Left)
        this.drawQRCode(ctx, 160, h - 360, 260);
    }

    drawGeometricAccents(ctx, w, h) {
        ctx.save();
        
        // Yellow accents
        ctx.fillStyle = '#F5B038';
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 6;

        // Top Left Hexagon fragment
        this.drawHexagonPath(ctx, 40, 260, 110);
        ctx.stroke();

        // Right side Hexagons
        ctx.fillStyle = '#E8A838';
        this.drawHexagonPath(ctx, w - 20, 840, 140);
        ctx.fill();
        ctx.stroke();

        this.drawHexagonPath(ctx, w - 40, 1260, 110);
        ctx.stroke();

        // Bottom Left Hexagon
        this.drawHexagonPath(ctx, 20, h - 220, 120);
        ctx.fill();
        ctx.stroke();

        // Decorative Circles / Polka dots
        const dots = [
            { x: w - 160, y: 340, r: 24, fill: '#18181B' },
            { x: w - 110, y: 440, r: 16, fill: '#E8A838' },
            { x: w - 90, y: 520, r: 28, fill: '#18181B' },
            { x: 120, y: 920, r: 20, fill: '#F5B038' },
            { x: 80, y: 1040, r: 32, fill: '#18181B' },
            { x: w - 260, y: 1540, r: 26, fill: '#18181B' },
            { x: w - 180, y: 1660, r: 38, stroke: '#18181B', width: 5 },
            { x: w - 100, y: 1780, r: 24, fill: '#F5B038' },
            { x: 620, y: h - 160, r: 45, stroke: '#18181B', width: 6 },
            { x: 740, y: h - 80, r: 30, fill: '#18181B' },
        ];

        dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            if (d.fill) {
                ctx.fillStyle = d.fill;
                ctx.fill();
            }
            if (d.stroke) {
                ctx.strokeStyle = d.stroke;
                ctx.lineWidth = d.width || 4;
                ctx.stroke();
            }
        });

        ctx.restore();
    }

    drawHeaderBanner(ctx, w) {
        ctx.save();
        
        // Yellow Arch Container
        ctx.beginPath();
        ctx.moveTo(140, 0);
        ctx.lineTo(w - 140, 0);
        ctx.lineTo(w - 180, 420);
        ctx.quadraticCurveTo(w / 2, 490, 180, 420);
        ctx.closePath();

        const bannerGrad = ctx.createLinearGradient(0, 0, 0, 480);
        bannerGrad.addColorStop(0, '#F5B738');
        bannerGrad.addColorStop(1, '#E8A020');
        ctx.fillStyle = bannerGrad;
        ctx.fill();

        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Header Text
        ctx.fillStyle = '#1E1B4B';
        ctx.textAlign = 'center';

        // Logo Icon graphic
        ctx.fillStyle = '#4C1D95';
        ctx.beginPath();
        ctx.arc(w / 2, 85, 34, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#E8A838';
        ctx.font = 'bold 32px Cairo';
        ctx.fillText('🎓', w / 2, 95);

        // Logo Brand Name
        ctx.fillStyle = '#4338CA';
        ctx.font = '800 36px Cairo';
        ctx.fillText('UMMU HABEEBA', w / 2, 160);
        ctx.fillStyle = '#1E1B4B';
        ctx.font = '700 24px Cairo';
        ctx.fillText('VIRTUAL CAMPUS', w / 2, 195);

        // Main Event Title: حفل تخرج حبيبة ٢٠٢٦
        ctx.fillStyle = '#18181B';
        ctx.font = 'bold 64px Cairo';
        const yearArabic = this.toArabicDigits('2026');
        ctx.fillText(`حفل تَخرّج حبيبة ${yearArabic}`, w / 2, 285);

        // Date & Location: ١٦ أغسطس / كاليكوت
        ctx.font = '700 52px Cairo';
        const dateArabic = this.toArabicDigits('16');
        ctx.fillText(`${dateArabic} أغسطس`, w / 2, 355);
        ctx.fillText('كاليكوت', w / 2, 425);

        ctx.restore();
    }

    drawHexagonPath(ctx, cx, cy, radius) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    drawPhotoHexagon(ctx, w, centerY, radius) {
        ctx.save();

        const cx = w / 2;
        const cy = centerY;

        // Draw Outer Thick Hexagon Border
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#18181B';
        this.drawHexagonPath(ctx, cx, cy, radius + 10);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.stroke();

        // Inner Hexagon for Photo Masking
        this.drawHexagonPath(ctx, cx, cy, radius);
        ctx.clip();

        if (this.data.photoImg) {
            // Draw photo centered & scaled to fill hexagon
            const img = this.data.photoImg;
            const aspect = img.width / img.height;
            let drawW = radius * 2.2;
            let drawH = drawW / aspect;
            if (drawH < radius * 2.2) {
                drawH = radius * 2.2;
                drawW = drawH * aspect;
            }
            ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
        } else {
            // Default Placeholder Graphic
            const grad = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
            grad.addColorStop(0, '#E2E8F0');
            grad.addColorStop(1, '#CBD5E1');
            ctx.fillStyle = grad;
            ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

            ctx.fillStyle = '#64748B';
            ctx.font = '800 120px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText('🎓', cx, cy + 40);
        }

        ctx.restore();
    }

    drawParticipantIdentity(ctx, w, startY) {
        ctx.save();
        ctx.textAlign = 'center';

        // Participant Name
        ctx.fillStyle = '#18181B';
        ctx.font = '800 60px Cairo';
        ctx.fillText(this.data.fullName || 'الاسم الكامل', w / 2, startY);

        // Role Pill Badge (e.g., متعلّمة / خريجة)
        const roleText = this.data.role || 'متعلّمة';
        ctx.font = '700 38px Cairo';
        const textMetrics = ctx.measureText(roleText);
        const pillW = Math.max(textMetrics.width + 100, 320);
        const pillH = 76;
        const pillX = w / 2 - pillW / 2;
        const pillY = startY + 30;

        // Black Pill Background
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 38);
        ctx.fill();

        // White Text inside Pill
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(roleText, w / 2, pillY + 52);

        ctx.restore();
    }

    drawDetailsList(ctx, w, startY) {
        ctx.save();

        const fields = [
            { label: 'الدُّفْعَة', value: this.data.batch },
            { label: 'السَّنَة', value: this.toArabicDigits(this.data.year) },
            { label: 'الصَّفّ', value: this.data.className },
            { label: 'الدَّؤْرَة', value: this.data.course },
        ];

        const lineGap = 90;
        const rightX = w - 180;
        const leftX = 180;

        fields.forEach((f, idx) => {
            const currentY = startY + (idx * lineGap);

            // Label on Right (Arabic RTL)
            ctx.textAlign = 'right';
            ctx.font = '800 42px Cairo';
            ctx.fillStyle = '#18181B';
            ctx.fillText(f.label, rightX, currentY);

            const labelWidth = ctx.measureText(f.label).width;
            const dotStartX = rightX - labelWidth - 25;

            // Value text width on Left
            ctx.textAlign = 'left';
            ctx.font = '700 38px Cairo';
            ctx.fillStyle = '#1E1B4B';
            const valueText = f.value || '.........................';
            ctx.fillText(valueText, leftX, currentY);

            const valueWidth = ctx.measureText(valueText).width;
            const dotEndX = leftX + valueWidth + 25;

            // Dotted Leader Line
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 4;
            ctx.setLineDash([8, 10]);
            ctx.beginPath();
            ctx.moveTo(dotStartX, currentY - 12);
            ctx.lineTo(dotEndX, currentY - 12);
            ctx.stroke();
            ctx.setLineDash([]);
        });

        ctx.restore();
    }

    drawQRCode(ctx, x, y, size) {
        ctx.save();

        // QR Container Box
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#18181B';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 20);
        ctx.fill();
        ctx.stroke();

        if (this.data.qrCodeImg) {
            ctx.drawImage(this.data.qrCodeImg, x + 16, y + 16, size - 32, size - 32);
        } else {
            // QR Placeholder box
            ctx.fillStyle = '#18181B';
            ctx.font = 'bold 24px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText('QR CODE', x + size / 2, y + size / 2 + 10);
        }

        ctx.restore();
    }

    getCanvasDataURL(format = 'image/png') {
        return this.canvas.toDataURL(format, 1.0);
    }
}

window.BadgeCanvasEngine = BadgeCanvasEngine;
