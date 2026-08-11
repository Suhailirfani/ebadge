/**
 * E-Badge Canvas Rendering Engine (Minimalist Sleek Digital ID with Watermarks)
 * Dark Navy & Soft Gold Palette | Smooth Circular Avatar | Book & Pen & Arabic Calligraphy Watermarks
 * UMMU HABEEBA VIRTUAL CAMPUS - Graduation 2026
 */

class BadgeCanvasEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // High DPI resolution for 8K-like crisp output (1080 x 1920)
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
        
        // Auto-generate initial QR Code
        this.setQRCodeText('UHV-DEMO2026');
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

    setQRCodeText(codeText) {
        if (!codeText) return;
        
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.visibility = 'hidden';
        document.body.appendChild(tempDiv);

        if (window.QRCode) {
            try {
                new window.QRCode(tempDiv, {
                    text: codeText,
                    width: 300,
                    height: 300,
                    correctLevel: window.QRCode.CorrectLevel.H
                });

                const checkAndSet = () => {
                    const canvasElem = tempDiv.querySelector('canvas');
                    const imgElem = tempDiv.querySelector('img');
                    let src = '';

                    if (canvasElem) {
                        try { src = canvasElem.toDataURL('image/png'); } catch (e) {}
                    }
                    if (!src && imgElem && imgElem.src && imgElem.src.length > 50) {
                        src = imgElem.src;
                    }

                    if (src) {
                        const img = new Image();
                        img.onload = () => {
                            this.setQRCode(img);
                            if (tempDiv.parentNode) tempDiv.parentNode.removeChild(tempDiv);
                        };
                        img.src = src;
                    } else {
                        setTimeout(checkAndSet, 50);
                    }
                };

                setTimeout(checkAndSet, 50);
            } catch (err) {
                console.error('Error in QRCode generation:', err);
                if (tempDiv.parentNode) tempDiv.parentNode.removeChild(tempDiv);
            }
        } else {
            console.warn('QRCode library not ready yet');
            if (tempDiv.parentNode) tempDiv.parentNode.removeChild(tempDiv);
        }
    }

    render() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.clearRect(0, 0, w, h);

        // 1. Dark Navy Gradient Background (#0F172A -> #1E1B4B -> #0B0F19)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0F172A');
        bgGrad.addColorStop(0.5, '#1E1B4B');
        bgGrad.addColorStop(1, '#0B0F19');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Soft Radial Gold Ambient Glow
        const ambientGlow = ctx.createRadialGradient(w / 2, 580, 50, w / 2, 580, 450);
        ambientGlow.addColorStop(0, 'rgba(212, 175, 55, 0.18)');
        ambientGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = ambientGlow;
        ctx.fillRect(0, 0, w, h);

        // 2. Subtle Watermarks: Book, Pen & Arabic Calligraphy Letters
        this.drawWatermarks(ctx, w, h);

        // 3. Frosted Glassmorphism Main Card Container
        this.drawGlassCard(ctx, 80, 80, w - 160, h - 160);

        // 4. Top Section: Institution Logo & Crisp Arabic Header
        this.drawTopInstitutionHeader(ctx, w, 150);

        // 5. Smooth Circular Avatar Portrait Frame
        this.drawCircularAvatar(ctx, w / 2, 600, 210);

        // 6. Participant Name & Status Pill Badge
        this.drawIdentitySection(ctx, w, 880);

        // 7. Aligned Key-Value Metadata Grid
        this.drawMetadataGrid(ctx, w, 1120);

        // 8. Integrated Bottom Corner Square QR Code
        this.drawBottomQRCode(ctx, 150, h - 420, 250);
    }

    drawWatermarks(ctx, w, h) {
        ctx.save();

        // --- A. Subtle Arabic Calligraphy Letters Watermark ---
        ctx.fillStyle = 'rgba(212, 175, 55, 0.04)';
        ctx.font = '700 160px Amiri';

        const arabicLetters = [
            { text: 'اقْرَأْ', x: 180, y: 350, rot: -0.15 },
            { text: 'ن وَالْقَلَمِ', x: w - 240, y: 480, rot: 0.12 },
            { text: 'عِلْم', x: 220, y: 1020, rot: 0.2 },
            { text: 'حِكْمَة', x: w - 260, y: 1150, rot: -0.18 },
            { text: 'ن', x: 140, y: 1550, rot: 0.1 },
            { text: 'ق', x: w - 180, y: 1650, rot: -0.15 },
        ];

        arabicLetters.forEach(item => {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rot);
            ctx.fillText(item.text, 0, 0);
            ctx.restore();
        });

        // --- B. Book & Pen Icon Watermarks ---
        ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.font = '900 240px Cairo';
        ctx.textAlign = 'center';
        
        ctx.fillText('📖', w / 2, 540);

        ctx.font = '900 220px Cairo';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.035)';
        ctx.fillText('✒️', w / 2 + 180, 1380);

        ctx.restore();
    }

    drawGlassCard(ctx, x, y, width, height) {
        ctx.save();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 36);
        ctx.fill();

        ctx.shadowColor = 'transparent';

        ctx.lineWidth = 2.5;
        const goldBorderGrad = ctx.createLinearGradient(x, y, x + width, y + height);
        goldBorderGrad.addColorStop(0, 'rgba(212, 175, 55, 0.6)');
        goldBorderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
        goldBorderGrad.addColorStop(1, 'rgba(212, 175, 55, 0.4)');
        ctx.strokeStyle = goldBorderGrad;
        ctx.stroke();

        ctx.restore();
    }

    drawTopInstitutionHeader(ctx, w, startY) {
        ctx.save();
        ctx.textAlign = 'center';

        ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w / 2, startY, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 36px Cairo';
        ctx.fillText('🎓', w / 2, startY + 12);

        ctx.fillStyle = '#D4AF37';
        ctx.font = '800 28px Cairo';
        ctx.fillText('UMMU HABEEBA VIRTUAL CAMPUS', w / 2, startY + 75);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 52px Cairo';
        const yearArabic = this.toArabicDigits('2026');
        ctx.fillText(`حفل تَخرّج حبيبة ${yearArabic}`, w / 2, startY + 145);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '700 32px Cairo';
        const dateArabic = this.toArabicDigits('16');
        ctx.fillText(`${dateArabic} أغسطس • كاليكوت`, w / 2, startY + 200);

        ctx.restore();
    }

    drawCircularAvatar(ctx, cx, cy, radius) {
        ctx.save();

        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.shadowBlur = 24;

        ctx.beginPath();
        ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.fill();

        ctx.lineWidth = 4;
        const ringGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
        ringGrad.addColorStop(0, '#F3E5AB');
        ringGrad.addColorStop(0.5, '#D4AF37');
        ringGrad.addColorStop(1, '#AA7C11');
        ctx.strokeStyle = ringGrad;
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        if (this.data.photoImg) {
            const img = this.data.photoImg;
            const aspect = img.width / img.height;
            let drawW = radius * 2;
            let drawH = drawW / aspect;
            if (drawH < radius * 2) {
                drawH = radius * 2;
                drawW = drawH * aspect;
            }
            ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
        } else {
            const bgGrad = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
            bgGrad.addColorStop(0, '#1E293B');
            bgGrad.addColorStop(1, '#0F172A');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

            ctx.fillStyle = '#94A3B8';
            ctx.font = '800 120px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText('🎓', cx, cy + 45);
        }

        ctx.restore();
    }

    drawIdentitySection(ctx, w, startY) {
        ctx.save();
        ctx.textAlign = 'center';

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 58px Cairo';
        ctx.fillText(this.data.fullName || 'الاسم الكامل', w / 2, startY);

        const roleText = this.data.role || 'متعلّمة';
        ctx.font = '700 32px Cairo';
        const textMetrics = ctx.measureText(roleText);
        const pillW = Math.max(textMetrics.width + 80, 260);
        const pillH = 64;
        const pillX = w / 2 - pillW / 2;
        const pillY = startY + 25;

        ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 32);
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#D4AF37';
        ctx.stroke();

        ctx.fillStyle = '#F3E5AB';
        ctx.fillText(roleText, w / 2, pillY + 44);

        ctx.restore();
    }

    drawMetadataGrid(ctx, w, startY) {
        ctx.save();

        const items = [
            { label: 'الدُّفْعَة', value: this.data.batch },
            { label: 'السَّنَة', value: this.toArabicDigits(this.data.year) },
            { label: 'الصَّفّ', value: this.data.className },
            { label: 'الدَّؤْرَة', value: this.data.course },
        ];

        const cardLeft = 140;
        const cardRight = w - 140;
        const rowHeight = 84;

        items.forEach((item, idx) => {
            const currentY = startY + (idx * rowHeight);

            if (idx > 0) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cardLeft, currentY - 20);
                ctx.lineTo(cardRight, currentY - 20);
                ctx.stroke();
            }

            ctx.textAlign = 'right';
            ctx.font = '800 36px Cairo';
            ctx.fillStyle = '#94A3B8';
            ctx.fillText(item.label, cardRight - 20, currentY + 20);

            ctx.textAlign = 'left';
            ctx.font = '700 36px Cairo';
            ctx.fillStyle = '#FFFFFF';
            const displayVal = item.value || '-';
            ctx.fillText(displayVal, cardLeft + 20, currentY + 20);
        });

        ctx.restore();
    }

    drawBottomQRCode(ctx, x, y, size) {
        ctx.save();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 20);
        ctx.fill();

        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.data.qrCodeImg) {
            ctx.drawImage(this.data.qrCodeImg, x + 14, y + 14, size - 28, size - 28);
        } else {
            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 22px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText('QR CODE', x + size / 2, y + size / 2 + 8);
        }

        ctx.restore();
    }

    getCanvasDataURL(format = 'image/png') {
        return this.canvas.toDataURL(format, 1.0);
    }
}

window.BadgeCanvasEngine = BadgeCanvasEngine;
