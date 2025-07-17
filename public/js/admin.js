// Admin Panel JavaScript

// Demo login credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '123456'
};

// Authentication Functions
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        `;
    }
}

function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    // Show loading state
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    loginBtn.disabled = true;
    
    // Hide previous error
    errorMessage.style.display = 'none';
    
    // Simulate API call
    setTimeout(() => {
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Success
            const sessionData = {
                username: username,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };
            
            if (rememberMe) {
                localStorage.setItem('adminSession', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
            }
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Error
            errorMessage.style.display = 'flex';
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
            
            // Shake animation
            errorMessage.style.animation = 'none';
            setTimeout(() => {
                errorMessage.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
        }
    }, 1000);
}

function logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        window.location.href = 'admin.html';
    }
}

function checkAuth() {
    const session = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!session && currentPage !== 'admin.html') {
        window.location.href = 'admin.html';
        return false;
    }
    
    if (session && currentPage === 'admin.html') {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// Data Management Functions
function initializeData() {
    // Initialize with demo data if no data exists
    if (!localStorage.getItem('adminData')) {
        const defaultData = {
            siteSettings: {
                companyName: 'Hızlı Çekici',
                phoneNumber: '+90 555 123 45 67',
                whatsappNumber: '905551234567',
                heroTitle: 'İstanbul\'un En Hızlı Çekici Hizmeti',
                heroSubtitle: 'Araç arızası mı yaşıyorsunuz? Kaza mı geçirdiniz? Ortalama 15 dakikada yanınızdayız.'
            },
            serviceAreas: [
                { id: 1, name: 'Bağcılar Oto Çekici', description: 'Bağcılar ve çevresinde 7/24 çekici hizmeti', active: true },
                { id: 2, name: 'Kağıthane Oto Çekici', description: 'Kağıthane bölgesinde hızlı müdahale', active: true },
                { id: 3, name: 'Beyoğlu Oto Çekici', description: 'Beyoğlu merkez ve çevresinde hizmet', active: true },
                { id: 4, name: 'Şişli Oto Çekici', description: 'Şişli ve Mecidiyeköy bölgesinde', active: true },
                { id: 5, name: 'Beşiktaş Oto Çekici', description: 'Beşiktaş ve Ortaköy bölgesinde', active: true },
                { id: 6, name: 'Bakırköy Oto Çekici', description: 'Bakırköy ve Ataköy bölgesinde', active: true },
                { id: 7, name: 'Fatih Oto Çekici', description: 'Fatih ve Eminönü bölgesinde', active: true },
                { id: 8, name: 'Beylikdüzü Oto Çekici', description: 'Beylikdüzü ve çevresinde', active: true },
                { id: 9, name: 'Avcılar Oto Çekici', description: 'Avcılar ve Küçükçekmece\'de', active: true },
                { id: 10, name: 'Bahçelievler Oto Çekici', description: 'Bahçelievler ve çevresinde', active: true },
                { id: 11, name: 'Sarıyer Oto Çekici', description: 'Sarıyer ve Maslak bölgesinde', active: true },
                { id: 12, name: 'Esenyurt Oto Çekici', description: 'Esenyurt ve Büyükçekmece\'de', active: true }
            ],
            statistics: {
                totalCalls: 247,
                totalWhatsApp: 185,
                totalVisitors: 1432,
                activeAreas: 12
            },
            callHistory: []
        };
        
        localStorage.setItem('adminData', JSON.stringify(defaultData));
    }
}

function getAdminData() {
    const data = localStorage.getItem('adminData');
    return data ? JSON.parse(data) : null;
}

function saveAdminData(data) {
    localStorage.setItem('adminData', JSON.stringify(data));
}

// Statistics Functions
function updateStatistics() {
    const data = getAdminData();
    if (!data) return;
    
    // Update dashboard stats
    const totalCallsEl = document.getElementById('totalCalls');
    const totalWhatsAppEl = document.getElementById('totalWhatsApp');
    const totalVisitorsEl = document.getElementById('totalVisitors');
    const activeAreasEl = document.getElementById('activeAreas');
    
    if (totalCallsEl) totalCallsEl.textContent = data.statistics.totalCalls;
    if (totalWhatsAppEl) totalWhatsAppEl.textContent = data.statistics.totalWhatsApp;
    if (totalVisitorsEl) totalVisitorsEl.textContent = data.statistics.totalVisitors.toLocaleString();
    if (activeAreasEl) activeAreasEl.textContent = data.statistics.activeAreas;
}

function recordCall(type, area = 'Bilinmiyor') {
    const data = getAdminData();
    if (!data) return;
    
    // Create call record
    const callRecord = {
        id: Date.now(),
        type: type, // 'phone' or 'whatsapp'
        area: area,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ip: '127.0.0.1' // Simulated IP
    };
    
    // Add to history
    data.callHistory.unshift(callRecord);
    
    // Keep only last 100 records
    if (data.callHistory.length > 100) {
        data.callHistory = data.callHistory.slice(0, 100);
    }
    
    // Update statistics
    if (type === 'phone') {
        data.statistics.totalCalls++;
    } else if (type === 'whatsapp') {
        data.statistics.totalWhatsApp++;
    }
    
    saveAdminData(data);
}

// Activity Functions
function generateDemoActivity() {
    const activities = [
        'Telefon araması yapıldı - Bağcılar bölgesi',
        'WhatsApp tıklandı - Şişli bölgesi',
        'Site ayarları güncellendi',
        'Yeni hizmet bölgesi eklendi: Test Bölgesi',
        'Telefon araması yapıldı - Beyoğlu bölgesi',
        'İstatistikler dışa aktarıldı',
        'Bölge ayarları güncellendi',
        'WhatsApp tıklandı - Beşiktaş bölgesi'
    ];
    
    return activities.slice(0, 5).map((activity, index) => ({
        id: Date.now() + index,
        message: activity,
        timestamp: new Date(Date.now() - (index * 15 * 60 * 1000)).toISOString(),
        type: activity.includes('Telefon') ? 'phone' : activity.includes('WhatsApp') ? 'whatsapp' : 'system'
    }));
}

function loadActivity() {
    const activityList = document.getElementById('activityList');
    const activityLoading = document.getElementById('activityLoading');
    
    if (!activityList) return;
    
    setTimeout(() => {
        const activities = generateDemoActivity();
        
        activityLoading.style.display = 'none';
        
        const activityHTML = activities.map(activity => {
            const date = new Date(activity.timestamp);
            const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const iconColor = activity.type === 'phone' ? 'green' : activity.type === 'whatsapp' ? 'blue' : 'yellow';
            
            return `
                <div class="activity-item" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                    <div class="activity-icon" style="width: 2rem; height: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: var(--${iconColor}-bg); color: var(--${iconColor}-color);">
                        ${activity.type === 'phone' ? '📞' : activity.type === 'whatsapp' ? '💬' : '⚙️'}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: #1f2937; margin-bottom: 0.25rem;">${activity.message}</div>
                        <div style="font-size: 0.75rem; color: #6b7280;">${timeStr}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        activityList.innerHTML = activityHTML;
    }, 1000);
}

function refreshActivity() {
    const activityList = document.getElementById('activityList');
    const activityLoading = document.getElementById('activityLoading');
    
    if (!activityList) return;
    
    activityList.innerHTML = '<div class="loading" id="activityLoading"><div class="loading-spinner"></div>Aktiviteler yenileniyor...</div>';
    loadActivity();
}

// Call History Functions
function loadCallHistory() {
    const callsTableBody = document.getElementById('callsTableBody');
    if (!callsTableBody) return;
    
    setTimeout(() => {
        const data = getAdminData();
        const calls = data ? data.callHistory.slice(0, 10) : [];
        
        if (calls.length === 0) {
            callsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #6b7280; padding: 2rem;">
                        Henüz çağrı kaydı bulunmuyor
                    </td>
                </tr>
            `;
            return;
        }
        
        const callsHTML = calls.map(call => {
            const date = new Date(call.timestamp);
            const dateStr = date.toLocaleDateString('tr-TR');
            const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
            const typeText = call.type === 'phone' ? '📞 Telefon' : '💬 WhatsApp';
            const shortUserAgent = call.userAgent.length > 50 ? call.userAgent.substring(0, 50) + '...' : call.userAgent;
            
            return `
                <tr>
                    <td>${dateStr} ${timeStr}</td>
                    <td>${typeText}</td>
                    <td>${call.area}</td>
                    <td>${call.ip}</td>
                    <td title="${call.userAgent}">${shortUserAgent}</td>
                </tr>
            `;
        }).join('');
        
        callsTableBody.innerHTML = callsHTML;
    }, 1500);
}

function exportCalls() {
    const data = getAdminData();
    if (!data || !data.callHistory.length) {
        alert('Dışa aktarılacak veri bulunamadı!');
        return;
    }
    
    // Create CSV content
    const headers = ['Tarih', 'Tür', 'Bölge', 'IP Adresi', 'User Agent'];
    const csvContent = [
        headers.join(','),
        ...data.callHistory.map(call => {
            const date = new Date(call.timestamp);
            const dateStr = `${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR')}`;
            const typeText = call.type === 'phone' ? 'Telefon' : 'WhatsApp';
            
            return [
                `"${dateStr}"`,
                `"${typeText}"`,
                `"${call.area}"`,
                `"${call.ip}"`,
                `"${call.userAgent.replace(/"/g, '""')}"`
            ].join(',');
        })
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cagri_kayitlari_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Site Settings Functions
function loadSiteSettings() {
    const data = getAdminData();
    if (!data) return;
    
    const settings = data.siteSettings;
    
    // Fill form fields
    const fields = ['companyName', 'phoneNumber', 'whatsappNumber', 'heroTitle', 'heroSubtitle'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && settings[field]) {
            element.value = settings[field];
        }
    });
}

function saveSiteSettings(event) {
    event.preventDefault();
    
    const data = getAdminData();
    if (!data) return;
    
    // Get form values
    const formData = new FormData(event.target);
    const settings = {};
    
    for (let [key, value] of formData.entries()) {
        settings[key] = value;
    }
    
    // Update data
    data.siteSettings = { ...data.siteSettings, ...settings };
    saveAdminData(data);
    
    // Show success message
    showSuccessMessage('Site ayarları başarıyla kaydedildi!');
    
    // Update phone number in main site script if needed
    updateMainSiteSettings(settings);
}

function updateMainSiteSettings(settings) {
    // This would normally update the main site's script.js file
    // For now, we'll just store it in localStorage for the main site to read
    localStorage.setItem('siteSettings', JSON.stringify(settings));
}

// Area Management Functions
function loadServiceAreas() {
    const data = getAdminData();
    if (!data) return;
    
    const areasContainer = document.getElementById('areasContainer');
    if (!areasContainer) return;
    
    const areas = data.serviceAreas;
    
    const areasHTML = areas.map(area => `
        <div class="area-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 0.5rem; background-color: ${area.active ? 'white' : '#f9fafb'};">
            <div style="flex: 1;">
                <h4 style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">${area.name}</h4>
                <p style="color: #6b7280; font-size: 0.875rem;">${area.description}</p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="status-badge" style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; ${area.active ? 'background-color: #dcfce7; color: #166534;' : 'background-color: #fee2e2; color: #991b1b;'}">
                    ${area.active ? 'Aktif' : 'Pasif'}
                </span>
                <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="editArea(${area.id})">Düzenle</button>
                <button class="btn ${area.active ? 'btn-danger' : 'btn-primary'}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="toggleArea(${area.id})">
                    ${area.active ? 'Pasifleştir' : 'Aktifleştir'}
                </button>
            </div>
        </div>
    `).join('');
    
    areasContainer.innerHTML = areasHTML;
}

function addArea(event) {
    event.preventDefault();
    
    const data = getAdminData();
    if (!data) return;
    
    const formData = new FormData(event.target);
    const newArea = {
        id: Date.now(),
        name: formData.get('areaName'),
        description: formData.get('areaDescription'),
        active: true
    };
    
    data.serviceAreas.push(newArea);
    data.statistics.activeAreas = data.serviceAreas.filter(a => a.active).length;
    saveAdminData(data);
    
    // Reset form
    event.target.reset();
    
    // Reload areas
    loadServiceAreas();
    
    showSuccessMessage('Yeni hizmet bölgesi eklendi!');
}

function toggleArea(areaId) {
    const data = getAdminData();
    if (!data) return;
    
    const area = data.serviceAreas.find(a => a.id === areaId);
    if (!area) return;
    
    area.active = !area.active;
    data.statistics.activeAreas = data.serviceAreas.filter(a => a.active).length;
    saveAdminData(data);
    
    loadServiceAreas();
    updateStatistics();
    
    showSuccessMessage(`Bölge ${area.active ? 'aktifleştirildi' : 'pasifleştirildi'}!`);
}

function editArea(areaId) {
    const data = getAdminData();
    if (!data) return;
    
    const area = data.serviceAreas.find(a => a.id === areaId);
    if (!area) return;
    
    const newName = prompt('Bölge adını düzenleyin:', area.name);
    if (!newName || newName === area.name) return;
    
    const newDescription = prompt('Bölge açıklamasını düzenleyin:', area.description);
    if (newDescription === null) return;
    
    area.name = newName;
    area.description = newDescription || area.description;
    saveAdminData(data);
    
    loadServiceAreas();
    showSuccessMessage('Bölge bilgileri güncellendi!');
}

// Utility Functions
function showSuccessMessage(message) {
    // Remove existing success messages
    const existingMessages = document.querySelectorAll('.success-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
        ${message}
    `;
    
    // Insert at the top of main content
    const main = document.querySelector('.admin-main');
    if (main) {
        main.insertBefore(successDiv, main.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }
}

// Tracking Integration for Main Site
function integrateTracking() {
    // This function should be called from the main site to record interactions
    window.trackCall = function(type, area) {
        recordCall(type, area);
    };
}

// Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    initializeData();
    
    // Check authentication
    if (!checkAuth()) return;
    
    // Set up login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    // Set up site settings form
    const siteSettingsForm = document.getElementById('siteSettingsForm');
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', saveSiteSettings);
        loadSiteSettings();
    }
    
    // Set up area form
    const areaForm = document.getElementById('areaForm');
    if (areaForm) {
        areaForm.addEventListener('submit', addArea);
        loadServiceAreas();
    }
    
    // Load dashboard data
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'dashboard.html') {
        updateStatistics();
        loadActivity();
        loadCallHistory();
    }
    
    // Update navigation active states
    updateNavigation();
    
    // Integrate tracking for main site
    integrateTracking();
});

function updateNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Export functions for global use
window.adminFunctions = {
    login,
    logout,
    togglePassword,
    saveSiteSettings,
    addArea,
    toggleArea,
    editArea,
    refreshActivity,
    exportCalls,
    recordCall
};

console.log('Admin panel loaded successfully! 🚛📊'); 