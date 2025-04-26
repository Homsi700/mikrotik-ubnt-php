document.addEventListener('DOMContentLoaded', function() {
    const addDeviceBtn = document.getElementById('addDeviceBtn');
    addDeviceBtn.addEventListener('click', function() {
        alert('سيتم قريباً فتح نافذة إضافة جهاز جديد!');
        // هنا سيتم لاحقاً فتح نافذة منبثقة لإضافة جهاز جديد
    });
});

// نافذة منبثقة لإضافة جهاز جديد
function createDeviceModal() {
    if (document.getElementById('deviceModal')) return;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'deviceModalOverlay';
    overlay.innerHTML = `
      <div class="modal" id="deviceModal">
        <button class="close-modal" title="إغلاق">&times;</button>
        <h2>إضافة جهاز جديد</h2>
        <form id="addDeviceForm">
          <label>نوع الجهاز</label>
          <select name="type" id="deviceType" required>
            <option value="mikrotik">مايكروتك</option>
            <option value="mimosa">ميموزا</option>
            <option value="ubnt">UBNT</option>
            <option value="broadband">بطاقة يوزر برودباند</option>
          </select>
          <div id="deviceFields">
            <!-- الحقول الديناميكية هنا -->
          </div>
          <div class="modal-actions">
            <button type="submit" class="settings-btn">حفظ</button>
            <button type="button" class="settings-btn close-modal" style="background:#ff5252;">إلغاء</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';

    // إغلاق النافذة
    overlay.querySelectorAll('.close-modal').forEach(btn => {
      btn.onclick = () => overlay.remove();
    });

    // جلب السيرفرات المضافة (نوع mikrotik فقط)
    let mikrotikServers = [];
    fetch('api/get_device_status.php')
      .then(res => res.json())
      .then(devices => {
        mikrotikServers = devices.filter(d => d.type === 'mikrotik');
      });

    // تغيير الحقول حسب نوع الجهاز
    const deviceType = overlay.querySelector('#deviceType');
    const deviceFields = overlay.querySelector('#deviceFields');
    function renderFields(type) {
      if (type === 'broadband') {
        // إذا كان هناك سيرفرات مايكروتك مضافة، اعرضها في قائمة
        let serverSelect = '';
        if (mikrotikServers.length > 0) {
          serverSelect = `<label>اختر السيرفر</label><select name="server" required>\n` +
            mikrotikServers.map(s => `<option value="${s.ip}">${s.name} (${s.ip})</option>`).join('') +
            `</select>`;
        } else {
          serverSelect = `<label>اختر السيرفر</label><input name="server" required placeholder="IP السيرفر أو اسمه">`;
        }
        // قائمة السرعات المطلوبة
        const speeds = [
          0.5, 1, 2, 4, 8, 16, 24, 30, 40, 50, 60, 70, 80, 90, 100
        ];
        let speedOptions = speeds.map(s => `<option value="${s}${s < 1 ? 'M' : 'M'}">${s < 1 ? (s*1024)+' Kbps' : s+' Mbps'}</option>`).join('');
        deviceFields.innerHTML = `
          <label>اسم المستخدم</label>
          <input name="username" required>
          <label>كلمة المرور</label>
          <input name="password" required type="password">
          ${serverSelect}
          <label>سرعة الإنترنت</label>
          <select name="speed" required>${speedOptions}</select>
          <label>مدة الاشتراك (يوم)</label>
          <input name="duration" required type="number" min="1">
        `;
      } else {
        // حقول مخصصة حسب نوع الجهاز
        let extraFields = '';
        if (type === 'mimosa' || type === 'ubnt') {
          extraFields = `
            <label>قوة إشارة التحذير (dBm)</label>
            <input name="signal_limit" required type="number" min="-100" max="0">
            <label>ترددات احتياطية (اختر حتى 10)</label>
            <select name="freqs" multiple size="5" required>
              <option value="5200">5200 MHz</option>
              <option value="5300">5300 MHz</option>
              <option value="5400">5400 MHz</option>
              <option value="5500">5500 MHz</option>
              <option value="5600">5600 MHz</option>
              <option value="5700">5700 MHz</option>
              <option value="5800">5800 MHz</option>
              <option value="5850">5850 MHz</option>
              <option value="5900">5900 MHz</option>
              <option value="5950">5950 MHz</option>
            </select>
          `;
        }
        deviceFields.innerHTML = `
          <label>اسم الجهاز</label>
          <input name="name" required>
          <label>IP الجهاز</label>
          <input name="ip" required>
          <label>اسم المستخدم</label>
          <input name="username" required>
          <label>كلمة المرور</label>
          <input name="password" required type="password">
          <label>حد سرعة التحذير (Mbps)</label>
          <input name="speed_limit" required type="number" min="1">
          ${extraFields}
        `;
      }
    }
    // عند تغيير نوع الجهاز أو بعد جلب السيرفرات
    deviceType.onchange = e => renderFields(e.target.value);
    // انتظر حتى جلب السيرفرات ثم اعرض الحقول
    setTimeout(() => renderFields(deviceType.value), 300);

    // معالجة الإرسال
    overlay.querySelector('#addDeviceForm').onsubmit = function(e) {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(this).entries());
      if(formData.freqs && Array.isArray(formData.freqs)){
        formData.freqs = Array.from(formData.freqs);
      }
      overlay.remove();
      sendDeviceData(formData);
    };
}

// جلب وعرض الأجهزة من devices.json
function renderDevices() {
    fetch('api/get_device_status.php')
        .then(res => res.json())
        .then(devices => {
            const container = document.querySelector('.cards-container');
            // إزالة كل البطاقات ما عدا زر الإضافة
            container.querySelectorAll('.device-card, .broadband').forEach(e => e.remove());
            // إضافة البطاقات من البيانات
            devices.forEach(device => {
                let card = document.createElement('div');
                card.className = 'device-card ' + device.type;
                let statusClass = device.status === 'online' ? 'online' : 'offline';
                let alertMsg = '';
                let hasAlert = false;
                if (device.type === 'mikrotik') {
                    hasAlert = !!device.alert;
                    alertMsg = '<div class="alert" style="display:'+(hasAlert?'flex':'none')+'"><i class="fa-solid fa-triangle-exclamation"></i> '+(device.alertMsg||'إنذار: تجاوز السرعة أو ضعف الإشارة!')+'</div>';
                    card.innerHTML = `
                        <div class="card-header"><i class="fa-solid fa-server"></i> <span>${device.name}</span></div>
                        <div class="card-body">
                            <div class="device-info">
                                <span><i class="fa-solid fa-network-wired"></i> IP: ${device.ip}</span>
                                <span><i class="fa-solid fa-user-shield"></i> ${device.username}</span>
                            </div>
                            <div class="device-status ${statusClass}"><i class="fa-solid fa-circle"></i> ${device.status==='online'?'متصل':'غير متصل'}</div>
                            <div class="device-stats">
                                <span><i class="fa-solid fa-arrow-up"></i> إرسال: <b>${device.tx||0} Mbps</b></span>
                                <span><i class="fa-solid fa-arrow-down"></i> استقبال: <b>${device.rx||0} Mbps</b></span>
                                <span><i class="fa-solid fa-users"></i> المستخدمون: <b>${device.users||0}</b></span>
                            </div>
                            ${alertMsg}
                        </div>
                        <div class="card-footer">
                            <button class="settings-btn" onclick="openDeviceMenu(event, this, '${device.type}', '${device.ip}')"><i class="fa-solid fa-cog"></i> إعدادات</button>
                        </div>
                    `;
                } else if (device.type === 'mimosa' || device.type === 'ubnt') {
                    hasAlert = !!device.alert;
                    alertMsg = '<div class="alert" style="display:'+(hasAlert?'flex':'none')+'"><i class="fa-solid fa-triangle-exclamation"></i> '+(device.alertMsg||'إنذار: تجاوز السرعة أو ضعف الإشارة!')+'</div>';
                    card.innerHTML = `
                        <div class="card-header"><i class="fa-solid fa-broadcast-tower"></i> <span>${device.name}</span></div>
                        <div class="card-body">
                            <div class="device-info">
                                <span><i class="fa-solid fa-network-wired"></i> IP: ${device.ip}</span>
                                <span><i class="fa-solid fa-user-shield"></i> ${device.username}</span>
                            </div>
                            <div class="device-status ${statusClass}"><i class="fa-solid fa-circle"></i> ${device.status==='online'?'متصل':'غير متصل'}</div>
                            <div class="device-stats">
                                <span><i class="fa-solid fa-arrow-up"></i> إرسال: <b>${device.tx||0} Mbps</b></span>
                                <span><i class="fa-solid fa-arrow-down"></i> استقبال: <b>${device.rx||0} Mbps</b></span>
                                <span><i class="fa-solid fa-signal"></i> الإشارة: <b>${device.signal||'-'} dBm</b></span>
                            </div>
                            ${alertMsg}
                        </div>
                        <div class="card-footer">
                            <button class="settings-btn" onclick="openDeviceMenu(event, this, '${device.type}', '${device.ip}')"><i class="fa-solid fa-cog"></i> إعدادات</button>
                        </div>
                    `;
                } else if (device.type === 'broadband') {
                    card.innerHTML = `
                        <div class="card-header"><i class="fa-solid fa-user-plus"></i> <span>يوزر برودباند</span></div>
                        <div class="card-body">
                            <div class="device-info">
                                <span><i class="fa-solid fa-user"></i> اسم المستخدم: ${device.username}</span>
                                <span><i class="fa-solid fa-server"></i> السيرفر: ${device.server}</span>
                            </div>
                            <div class="device-status online"><i class="fa-solid fa-circle"></i> مفعل</div>
                            <div class="device-stats">
                                <span><i class="fa-solid fa-gauge"></i> السرعة: <b>${device.speed} Mbps</b></span>
                                <span><i class="fa-solid fa-clock"></i> المدة: <b>${device.duration} يوم</b></span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="settings-btn" onclick="openDeviceMenu(event, this, '${device.type}', '${device.ip}')"><i class="fa-solid fa-cog"></i> إعدادات</button>
                        </div>
                    `;
                }
                // إضافة تأثير التوهج إذا كان هناك إنذار
                if (hasAlert) {
                    card.classList.add('alert-glow');
                }
                container.insertBefore(card, container.querySelector('.add-card'));
            });

            let broadbandUsers = devices.filter(d => d.type === 'broadband');
            let totalUsers = broadbandUsers.length;
            let totalTx = 0, totalRx = 0;
            broadbandUsers.forEach(u => {
                totalTx += parseFloat(u.tx || 0);
                totalRx += parseFloat(u.rx || 0);
            });
            // بطاقة إجمالية لليوزر برودباند
            if (totalUsers > 0) {
                let card = document.createElement('div');
                card.className = 'device-card broadband summary';
                card.innerHTML = `
                    <div class="card-header">
                        <i class="fa-solid fa-users"></i>
                        <span>إجمالي يوزر برودباند</span>
                    </div>
                    <div class="card-body">
                        <div class="device-info">
                            <span><i class="fa-solid fa-user-check"></i> المتصلون: <b>${totalUsers}</b></span>
                        </div>
                        <div class="device-stats">
                            <span><i class="fa-solid fa-arrow-down"></i> استقبال: <b>${totalRx.toFixed(2)} Mbps</b></span>
                            <span><i class="fa-solid fa-arrow-up"></i> إرسال: <b>${totalTx.toFixed(2)} Mbps</b></span>
                        </div>
                        <div style="margin-top:18px;text-align:center;">
                            <button class="details-btn" onclick="showBroadbandDetails()"><i class='fa-solid fa-list'></i> تفاصيل</button>
                        </div>
                    </div>
                `;
                container.insertBefore(card, container.querySelector('.add-card'));
            }
        });
}

// نافذة تفاصيل يوزر برودباند
window.showBroadbandDetails = function() {
    // جلب بيانات يوزر برودباند من آخر تحديث
    fetch('api/get_device_status.php')
        .then(res => res.json())
        .then(devices => {
            let users = devices.filter(d => d.type === 'broadband');
            let html = `<div class='broadband-details-modal'><div class='modal-content'><h2>تفاصيل يوزر برودباند</h2><table><thead><tr><th>اسم المستخدم</th><th>إرسال</th><th>استقبال</th><th>أيام مضت</th><th>أيام متبقية</th><th>تنبيه</th></tr></thead><tbody>`;
            const now = new Date();
            users.forEach(u => {
                let start = u.start_date ? new Date(u.start_date) : null;
                let duration = parseInt(u.duration || 30);
                let daysPassed = start ? Math.floor((now - start) / (1000*60*60*24)) : 0;
                let daysLeft = start ? Math.max(0, duration - daysPassed) : duration;
                let expired = daysLeft <= 0;
                html += `<tr${expired ? " class='expired'" : ''}>
                    <td>${u.username}</td>
                    <td>${u.tx || 0} Mbps</td>
                    <td>${u.rx || 0} Mbps</td>
                    <td>${daysPassed}</td>
                    <td>${daysLeft}</td>
                    <td>${expired ? "<span class='expired-alert'>انتهت المدة!</span>" : ''}</td>
                </tr>`;
            });
            html += `</tbody></table><button class='close-details' onclick='closeBroadbandDetails()'>إغلاق</button></div></div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        });
}
window.closeBroadbandDetails = function() {
    document.querySelectorAll('.broadband-details-modal').forEach(e => e.remove());
}

// تحديث البطاقات كل 2 ثانية (تحديث لحظي أسرع)
setInterval(renderDevices, 2000);
renderDevices();

// إرسال بيانات الجهاز الجديد
function sendDeviceData(data) {
    fetch('api/add_device.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json()).then(r => {
        if (r.success) renderDevices();
    });
}

// قائمة إعدادات سريعة لكل بطاقة
function openDeviceMenu(e, btn, type, ip) {
    e.preventDefault();
    // إزالة أي قائمة مفتوحة مسبقاً
    document.querySelectorAll('.device-menu').forEach(m => m.remove());
    // إنشاء القائمة
    const menu = document.createElement('div');
    menu.className = 'device-menu';
    menu.innerHTML = `
      <button onclick="window.open('http://${ip}', '_blank')"><i class='fa-solid fa-globe'></i> فتح واجهة الجهاز</button>
      <button onclick="refreshDevice('${ip}', this)"><i class='fa-solid fa-arrows-rotate'></i> تحديث الحالة</button>
      ${type === 'mikrotik' || type === 'mimosa' || type === 'ubnt' ? `<button onclick="restartDevice('${type}','${ip}', this)"><i class='fa-solid fa-power-off'></i> إعادة تشغيل</button>` : ''}
      <button onclick="this.parentElement.remove()" style="color:#ff5252"><i class='fa-solid fa-xmark'></i> إغلاق</button>
    `;
    menu.style.position = 'absolute';
    menu.style.left = btn.offsetLeft + 'px';
    menu.style.top = (btn.offsetTop + btn.offsetHeight + 8) + 'px';
    btn.parentElement.appendChild(menu);
}

// تحديث حالة جهاز (محاكاة)
function refreshDevice(ip, btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ...';
    setTimeout(() => { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> تحديث الحالة'; renderDevices(); }, 1200);
}

// إعادة تشغيل جهاز (محاكاة)
function restartDevice(type, ip, btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ...';
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-power-off"></i> إعادة تشغيل';
        alert('تم إرسال أمر إعادة التشغيل إلى '+type+' ('+ip+') (محاكاة)');
    }, 1500);
}

// إغلاق القائمة عند الضغط خارجها
window.addEventListener('click', function(e) {
    document.querySelectorAll('.device-menu').forEach(m => {
        if (!m.contains(e.target)) m.remove();
    });
}, true);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addDeviceBtn').onclick = createDeviceModal;
});

// إضافة مستمعي الأحداث لأزرار الإعدادات
document.querySelectorAll('.settings-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = this.nextElementSibling;
        closeAllDropdowns();
        dropdown.classList.toggle('show');
    });
});

// إغلاق القوائم المنسدلة عند النقر خارجها
document.addEventListener('click', function() {
    closeAllDropdowns();
});

function closeAllDropdowns() {
    document.querySelectorAll('.settings-dropdown').forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// وظيفة إعادة تشغيل الجهاز
async function rebootDevice(deviceType, ip) {
    if (confirm('هل أنت متأكد من إعادة تشغيل الجهاز؟')) {
        try {
            const response = await fetch(`api/device_status_${deviceType}.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'reboot',
                    ip: ip
                })
            });
            
            const result = await response.json();
            if (result.success) {
                alert('تم إرسال أمر إعادة التشغيل بنجاح');
            } else {
                alert('حدث خطأ أثناء محاولة إعادة التشغيل');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الاتصال');
        }
    }
}

// وظيفة فتح في المتصفح
function openInBrowser(url) {
    window.open(url, '_blank');
}

// وظيفة إلغاء الاشتراك
async function cancelSubscription(username) {
    if (confirm('هل أنت متأكد من إلغاء اشتراك هذا المستخدم؟')) {
        try {
            const response = await fetch('api/add_broadband_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'cancel',
                    username: username
                })
            });
            
            const result = await response.json();
            if (result.success) {
                alert('تم إلغاء الاشتراك بنجاح');
                location.reload();
            } else {
                alert('حدث خطأ أثناء محاولة إلغاء الاشتراك');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الاتصال');
        }
    }
}

// مستمعي الأحداث لعرض معلومات الاشتراك
document.querySelectorAll('.view-subscription').forEach(btn => {
    btn.addEventListener('click', async function() {
        const card = this.closest('.device-card');
        const username = card.querySelector('.device-info span:first-child').textContent.split(': ')[1];
        
        try {
            const response = await fetch('api/get_device_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'get_subscription_info',
                    username: username
                })
            });
            
            const data = await response.json();
            if (data.success) {
                showSubscriptionInfo(data.info);
            } else {
                alert('لا يمكن الحصول على معلومات الاشتراك');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الاتصال');
        }
    });
});

function showSubscriptionInfo(info) {
    // إنشاء نافذة معلومات الاشتراك
    const modal = document.createElement('div');
    modal.className = 'subscription-info';
    modal.innerHTML = `
        <button class="close-btn"><i class="fas fa-times"></i></button>
        <h3>معلومات الاشتراك</h3>
        <div class="info-row">
            <span>اسم المستخدم:</span>
            <span>${info.username}</span>
        </div>
        <div class="info-row">
            <span>تاريخ البدء:</span>
            <span>${info.startDate}</span>
        </div>
        <div class="info-row">
            <span>تاريخ الانتهاء:</span>
            <span>${info.endDate}</span>
        </div>
        <div class="info-row">
            <span>المدة المتبقية:</span>
            <span>${info.remainingDays} يوم</span>
        </div>
        <div class="info-row">
            <span>السرعة:</span>
            <span>${info.speed} Mbps</span>
        </div>
        <div class="info-row">
            <span>الحالة:</span>
            <span>${info.status === 'active' ? 'مفعل' : 'غير مفعل'}</span>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إغلاق النافذة
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
}

// دالة لتحديث بيانات الأجهزة
async function updateDeviceInfo() {
    // تحديث معلومات المايكروتك
    try {
        const mikrotikResponse = await fetch('api/device_status_router.php');
        const mikrotikData = await mikrotikResponse.json();
        if (mikrotikData.success) {
            updateMikrotikCard(mikrotikData);
        }
    } catch (error) {
        console.error('خطأ في تحديث بيانات المايكروتك:', error);
    }

    // تحديث معلومات Mimosa
    try {
        const mimosaResponse = await fetch('api/device_status_mimosa.php');
        const mimosaData = await mimosaResponse.json();
        if (mimosaData && mimosaData.status) {
            updateMimosaCard(mimosaData);
        }
    } catch (error) {
        console.error('خطأ في تحديث بيانات Mimosa:', error);
    }
}

// تحديث معلومات المايكروتك في الواجهة
function updateMikrotikCard(data) {
    const card = document.querySelector('.device-card.mikrotik');
    if (!card) return;
    
    const activeUsers = data.active_users.length;
    const interfaces = data.interfaces.length;
    
    card.querySelector('.device-info').innerHTML = `
        <span><i class="fa-solid fa-users"></i> المستخدمين النشطين: ${activeUsers}</span>
        <span><i class="fa-solid fa-network-wired"></i> الواجهات: ${interfaces}</span>
    `;
}

// تحديث معلومات Mimosa في الواجهة
function updateMimosaCard(data) {
    const card = document.querySelector('.device-card.mimosa');
    if (!card) return;
    
    card.querySelector('.device-info').innerHTML = `
        <span><i class="fa-solid fa-signal"></i> قوة الإشارة: ${data.status.rssi || 'غير متوفر'}</span>
        <span><i class="fa-solid fa-wifi"></i> السرعة: ${data.status.txRate || 'غير متوفر'}</span>
    `;
}

// تحديث البيانات كل 30 ثانية
document.addEventListener('DOMContentLoaded', () => {
    updateDeviceInfo();
    setInterval(updateDeviceInfo, 30000);
});