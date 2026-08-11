/**
 * E-Badge High-DPI Canvas Rendering Engine (Modern Visually Appealing Edition)
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

        this.fontsLoaded = false;
        this.loadFonts();
    }

    async loadFonts() {
        try {
            await document.fonts.load('900 36px Cairo');
            await document.fonts.load('700 30px Amiri');
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

        // 1. Background Fill with Subtle Sunburst & Cream Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#FFFDF7');
        bgGrad.addColorStop(0.5, '#FAF5E8');
        bgGrad.addColorStop(1, '#FFFBF0');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Subtle Radial Glow in Center
        const radialGlow = ctx.createRadialGradient(w / 2, 700, 100, w / 2, 700, 600);
        radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
        radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radialGlow;
        ctx.fillRect(0, 0, w, h);

        // 2. Modern Geometric Accents & Floating Gold Shapes
        this.drawGeometricAccents(ctx, w, h);

        // 3. Top Yellow/Gold 3D Arch Header Banner
        this.drawHeaderBanner(ctx, w);

        // 4. Central Metallic Hexagonal Photo Frame
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
        
        // Polished Gold & Dark Hexagons
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 6;

        // Top Left Hexagon Outline
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
        this.drawHexagonPath(ctx, 40, 260, 110);
        ctx.stroke();

        // Right side Floating Hexagons
        ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
        this.drawHexagonPath(ctx, w - 30, 840, 140);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
        this.drawHexagonPath(ctx, w - 40, 1260, 110);
        ctx.stroke();

        // Bottom Left Hexagon
        ctx.fillStyle = '#F59E0B';
        this.drawHexagonPath(ctx, 30, h - 220, 120);
        ctx.fill();
        ctx.stroke();

        // Floating Decorative Circles
        const dots = [
            { x: w - 160, y: 340, r: 24, fill: '#0F172A' },
            { x: w - 110, y: 440, r: 16, fill: '#F59E0B' },
            { x: w - 90, y: 520, r: 28, fill: '#0F172A' },
            { x: 120, y: 920, r: 20, fill: '#F59E0B' },
            { x: 80, y: 1040, r: 32, fill: '#0F172A' },
            { x: w - 260, y: 1540, r: 26, fill: '#0F172A' },
            { x: w - 180, y: 1660, r: 38, stroke: '#0F172A', width: 5 },
            { x: w - 100, y: 1780, r: 24, fill: '#F59E0B' },
            { x: 620, y: h - 160, r: 45, stroke: '#0F172A', width: 6 },
            { x: 740, y: h - 80, r: 30, fill: '#0F172A' },
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
        
        // Drop Shadow for Banner
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 8;

        // Curved Gold Arch Container
        ctx.beginPath();
        ctx.moveTo(130, 0);
        ctx.lineTo(w - 130, 0);
        ctx.lineTo(w - 170, 420);
        ctx.quadraticCurveTo(w / 2, 495, 170, 420);
        ctx.closePath();

        const bannerGrad = ctx.createLinearGradient(0, 0, 0, 480);
        bannerGrad.addColorStop(0, '#FBBF24');
        bannerGrad.addColorStop(0.5, '#F59E0B');
        bannerGrad.addColorStop(1, '#D97706');
        ctx.fillStyle = bannerGrad;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Header Text & Logo
        ctx.textAlign = 'center';

        // Logo Purple Dome Circle
        ctx.fillStyle = '#312E81';
        ctx.beginPath();
        ctx.arc(w / 2, 85, 36, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 34px Cairo';
        ctx.fillText('🎓', w / 2, 96);

        // Brand Sub-heading
        ctx.fillStyle = '#312E81';
        ctx.font = '900 36px Cairo';
        ctx.fillText('UMMU HABEEBA', w / 2, 160);
        ctx.fillStyle = '#0F172A';
        ctx.font = '800 24px Cairo';
        ctx.fillText('VIRTUAL CAMPUS', w / 2, 195);

        // Main Event Title: حفل تخرج حبيبة ٢٠٢٦
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 64px Cairo';
        const yearArabic = this.toArabicDigits('2026');
        ctx.fillText(`حفل تَخرّج حبيبة ${yearArabic}`, w / 2, 285);

        // Date & Location Pill Accent
        ctx.font = '800 48px Cairo';
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

        // Outer Hexagon Drop Shadow & Glow Ring
        ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;

        ctx.lineWidth = 16;
        ctx.strokeStyle = '#0F172A';
        this.drawHexagonPath(ctx, cx, cy, radius + 12);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        // Gold Ring Overlay
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#F59E0B';
        this.drawHexagonPath(ctx, cx, cy, radius + 4);
        ctx.stroke();

        // Inner Hexagon Clip Mask
        this.drawHexagonPath(ctx, cx, cy, radius);
        ctx.clip();

        if (this.data.photoImg) {
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
            // Default Stylish Student Placeholder
            const grad = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
            grad.addColorStop(0, '#E2E8F0');
            grad.addColorStop(1, '#CBD5E1');
            ctx.fillStyle = grad;
            ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

            ctx.fillStyle = '#475569';
            ctx.font = '900 130px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText('🎓', cx, cy + 45);
        }

        ctx.restore();
    }

    drawParticipantIdentity(ctx, w, startY) {
        ctx.save();
        ctx.textAlign = 'center';

        // Participant Full Name
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 62px Cairo';
        ctx.fillText(this.data.fullName || 'الاسم الكامل', w / 2, startY);

        // Role Pill Badge (e.g. متعلّمة / خريجة)
        const roleText = this.data.role || 'متعلّمة';
        ctx.font = '800 38px Cairo';
        const textMetrics = ctx.measureText(roleText);
        const pillW = Math.max(textMetrics.width + 110, 330);
        const pillH = 78;
        const pillX = w / 2 - pillW / 2;
        const pillY = startY + 30;

        // Shadow & Gradient for Role Pill
        ctx.shadowColor = 'rgba(15, 23, 42, 0.2)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 39);
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Subtle Gold Border around Pill
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#F59E0B';
        ctx.stroke();

        // White Pill Text
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(roleText, w / 2, pillY + 53);

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
            ctx.font = '900 42px Cairo';
            ctx.fillStyle = '#0F172A';
            ctx.fillText(f.label, rightX, currentY);

            const labelWidth = ctx.measureText(f.label).width;
            const dotStartX = rightX - labelWidth - 25;

            // Value text on Left
            ctx.textAlign = 'left';
            ctx.font = '700 38px Cairo';
            ctx.fillStyle = '#1E1B4B';
            const valueText = f.value || '.........................';
            ctx.fillText(valueText, leftX, currentY);

            const valueWidth = ctx.measureText(valueText).width;
            const dotEndX = leftX + valueWidth + 25;

            // Dotted Leader Line
            ctx.strokeStyle = '#94A3B8';
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

        // Drop shadow for QR container
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 24);
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        // Inner Gold Border Accent
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x + 5, y + 5, size - 10, size - 10, 20);
        ctx.stroke();

        if (this.data.qrCodeImg) {
            ctx.drawImage(this.data.qrCodeImg, x + 16, y + 16, size - 32, size - 32);
        } else {
            ctx.fillStyle = '#0F172A';
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
