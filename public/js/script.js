// Telefon numarası
const phoneNumber = "+90 555 123 45 67";

// Telefon arama fonksiyonu
function handleCall() {
    // Tıklama takibi
    if (typeof window.trackCall === 'function') {
        window.trackCall('phone', 'Ana Site');
    }
    
    // Telefon linkini aç
    window.location.href = `tel:${phoneNumber}`;
}

// WhatsApp fonksiyonu
function handleWhatsApp() {
    const message = "Merhaba, acil çekici hizmeti için yardıma ihtiyacım var.";
    const whatsappNumber = "905551234567"; // + işareti olmadan
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Tıklama takibi
    if (typeof window.trackCall === 'function') {
        window.trackCall('whatsapp', 'Ana Site');
    }
    
    // Yeni sekmede WhatsApp'ı aç
    window.open(whatsappUrl, "_blank");
}

// Sayfa yüklendiğinde çalışacak fonksiyonlar
// Admin panel entegrasyonu
function loadAdminSettings() {
    try {
        const siteSettings = localStorage.getItem('siteSettings');
        if (siteSettings) {
            const settings = JSON.parse(siteSettings);
            
            // Telefon numarasını güncelle
            if (settings.phoneNumber) {
                phoneNumber = settings.phoneNumber;
                // Sayfadaki tüm telefon numaralarını güncelle
                const phoneElements = document.querySelectorAll('[href^="tel:"], .phone-number');
                phoneElements.forEach(el => {
                    if (el.href) el.href = `tel:${phoneNumber}`;
                    if (el.textContent && el.textContent.includes('+90')) {
                        el.textContent = phoneNumber;
                    }
                });
            }
            
            // WhatsApp numarasını güncelle
            if (settings.whatsappNumber) {
                whatsappNumber = settings.whatsappNumber;
            }
            
            // Başlıkları güncelle
            if (settings.heroTitle) {
                const titleElements = document.querySelectorAll('.hero-title');
                titleElements.forEach(el => {
                    el.innerHTML = settings.heroTitle.replace(' Çekici Hizmeti', '<span class="text-accent"> Çekici Hizmeti</span>');
                });
            }
            
            // Alt başlığı güncelle
            if (settings.heroSubtitle) {
                const subtitleElements = document.querySelectorAll('.hero-description');
                subtitleElements.forEach(el => {
                    el.textContent = settings.heroSubtitle;
                });
            }
        }
    } catch (error) {
        console.warn('Admin ayarları yüklenemedi:', error);
    }
}

// Tıklama takip fonksiyonu
function initializeTracking() {
    // Admin panel tracking fonksiyonunu yükle
    const script = document.createElement('script');
    script.textContent = `
        // Tracking function for admin panel
        window.trackCall = function(type, area) {
            try {
                let adminData = localStorage.getItem('adminData');
                if (!adminData) return;
                
                adminData = JSON.parse(adminData);
                
                // Create call record
                const callRecord = {
                    id: Date.now(),
                    type: type,
                    area: area || 'Ana Site',
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    ip: '127.0.0.1'
                };
                
                // Add to history
                adminData.callHistory = adminData.callHistory || [];
                adminData.callHistory.unshift(callRecord);
                
                // Keep only last 100 records
                if (adminData.callHistory.length > 100) {
                    adminData.callHistory = adminData.callHistory.slice(0, 100);
                }
                
                // Update statistics
                if (type === 'phone') {
                    adminData.statistics.totalCalls++;
                } else if (type === 'whatsapp') {
                    adminData.statistics.totalWhatsApp++;
                }
                
                localStorage.setItem('adminData', JSON.stringify(adminData));
            } catch (error) {
                console.warn('Tracking error:', error);
            }
        };
    `;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    // Admin ayarlarını yükle
    loadAdminSettings();
    
    // Takip sistemini başlat
    initializeTracking();
    // Smooth scrolling için tüm iç linkleri kontrol et
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll animasyonları için intersection observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Animasyon için elementleri gözlemle
    const elementsToAnimate = document.querySelectorAll('.service-card, .area-card, .contact-card, .feature');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Header'da scroll efekti
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Aşağı scroll - header'ı gizle
            header.style.transform = 'translateY(-100%)';
        } else {
            // Yukarı scroll - header'ı göster
            header.style.transform = 'translateY(0)';
        }
        
        // Header background opacity
        if (scrollTop > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Mobil sticky button için scroll kontrolü
    const mobileButton = document.querySelector('.mobile-sticky-btn');
    
    if (mobileButton) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Sayfanın sonuna yaklaşınca butonu gizle
            if (scrollTop + windowHeight > documentHeight - 200) {
                mobileButton.style.transform = 'translateY(100%)';
            } else {
                mobileButton.style.transform = 'translateY(0)';
            }
        });
    }

    // Button hover efektleri
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Loading state için button click animasyonu
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Sadece çekici hizmeti butonları için loading state
            if (this.onclick && (this.onclick.toString().includes('handleCall') || this.onclick.toString().includes('handleWhatsApp'))) {
                const originalText = this.innerHTML;
                this.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1000);
            }
        });
    });

    // Form validasyon (eğer ileride form eklenirse)
    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Local storage için tercih kaydı
    function saveUserPreference(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage is not available');
        }
    }

    function getUserPreference(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.warn('LocalStorage is not available');
            return null;
        }
    }

    // Performance için lazy loading (gelecekte resimler için)
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Çağırma istatistikleri (opsiyonel analytics)
    function trackCall() {
        // Google Analytics veya başka analytics servisi için
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_call', {
                'event_category': 'contact',
                'event_label': 'header_phone'
            });
        }
        
        // Kendi analytics
        saveUserPreference('last_call_time', new Date().toISOString());
    }

    function trackWhatsApp() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'contact',
                'event_label': 'whatsapp_button'
            });
        }
        
        saveUserPreference('last_whatsapp_time', new Date().toISOString());
    }

    // Acil durum bildirimi (eğer kullanıcı sayfayı uzun süre açık tutarsa)
    let emergencyNotificationTimeout;
    
    function showEmergencyNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #268835;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div>
                    <div style="font-weight: 600;">Acil mi?</div>
                    <div style="font-size: 0.875rem;">Hemen arayın!</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">&times;</button>
            </div>
        `;
        
        notification.addEventListener('click', function(e) {
            if (e.target.tagName !== 'BUTTON') {
                handleCall();
                this.remove();
            }
        });
        
        document.body.appendChild(notification);
        
        // 10 saniye sonra otomatik kapat
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    // 2 dakika sonra acil durum bildirimi göster
    emergencyNotificationTimeout = setTimeout(showEmergencyNotification, 120000);

    // Sayfa kapatılırken temizlik
    window.addEventListener('beforeunload', function() {
        if (emergencyNotificationTimeout) {
            clearTimeout(emergencyNotificationTimeout);
        }
    });

    console.log('Hızlı Çekici website loaded successfully! 🚛');
});

// CSS animasyonu ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .header {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .mobile-sticky-btn {
        transition: transform 0.3s ease;
    }
`;

document.head.appendChild(style); 