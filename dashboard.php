<?php
// التحقق من تسجيل الدخول
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['username'], $_POST['password'])) {
    // بيانات دخول افتراضية للتجربة
    $valid_user = 'admin';
    $valid_pass = 'admin123';
    if ($_POST['username'] === $valid_user && $_POST['password'] === $valid_pass) {
        $_SESSION['logged_in'] = true;
    } else {
        header('Location: index.php?error=1');
        exit;
    }
}
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <title>لوحة التحكم - إدارة الشبكة</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="logo">شبكتي<span class="dot">.</span></div>
        <div class="user-info">
            <span id="datetime" style="font-size:1.05rem;"></span>
            <i class="fa-solid fa-user"></i> مرحباً، <?php echo htmlspecialchars($valid_user); ?>
            <a href="logout.php" class="logout-btn"><i class="fa-solid fa-sign-out-alt"></i> خروج</a>
        </div>
    </nav>
    <main class="dashboard">
        <div class="dashboard-header">
            <h1>لوحة التحكم الرئيسية</h1>
            <button class="add-main-btn" id="addDeviceBtn"><i class="fa-solid fa-plus"></i> إضافة</button>
        </div>
        <div class="cards-container main-cards">
            <div class="device-card mikrotik">
                <button class="settings-btn">
                    <i class="fas fa-cog"></i>
                </button>
                <div class="settings-dropdown">
                    <div class="dropdown-item" onclick="rebootDevice('mikrotik', '192.168.88.1')">
                        <i class="fas fa-sync"></i> إعادة تشغيل
                    </div>
                    <div class="dropdown-item" onclick="openInBrowser('http://192.168.88.1')">
                        <i class="fas fa-external-link-alt"></i> فتح في المتصفح
                    </div>
                </div>
                <div class="card-header"><i class="fa-solid fa-server"></i> سيرفر مايكروتك</div>
                <div class="card-body">
                    <div class="device-info">
                        <span><i class="fa-solid fa-network-wired"></i> IP: 192.168.88.1</span>
                        <span><i class="fa-solid fa-user-shield"></i> admin</span>
                    </div>
                    <div class="device-status online"><i class="fa-solid fa-circle"></i> متصل</div>
                    <div class="device-stats">
                        <span><i class="fa-solid fa-arrow-up"></i> إرسال: <b>12 Mbps</b></span>
                        <span><i class="fa-solid fa-arrow-down"></i> استقبال: <b>25 Mbps</b></span>
                        <span><i class="fa-solid fa-users"></i> المستخدمون: <b>34</b></span>
                    </div>
                </div>
            </div>
            <div class="device-card mimosa">
                <button class="settings-btn">
                    <i class="fas fa-cog"></i>
                </button>
                <div class="settings-dropdown">
                    <div class="dropdown-item" onclick="rebootDevice('mimosa', '192.168.1.10')">
                        <i class="fas fa-sync"></i> إعادة تشغيل
                    </div>
                    <div class="dropdown-item" onclick="openInBrowser('http://192.168.1.10')">
                        <i class="fas fa-external-link-alt"></i> فتح في المتصفح
                    </div>
                </div>
                <div class="card-header"><i class="fa-solid fa-broadcast-tower"></i> طبق ميموزا</div>
                <div class="card-body">
                    <div class="device-info">
                        <span><i class="fa-solid fa-network-wired"></i> IP: 192.168.1.10</span>
                        <span><i class="fa-solid fa-user-shield"></i> admin</span>
                    </div>
                    <div class="device-status online"><i class="fa-solid fa-circle"></i> متصل</div>
                    <div class="device-stats">
                        <span><i class="fa-solid fa-arrow-up"></i> إرسال: <b>32 Mbps</b></span>
                        <span><i class="fa-solid fa-arrow-down"></i> استقبال: <b>41 Mbps</b></span>
                        <span><i class="fa-solid fa-signal"></i> الإشارة: <b>-65 dBm</b></span>
                    </div>
                </div>
            </div>
            <div class="device-card ubnt">
                <button class="settings-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                <div class="settings-dropdown">
                    <div class="dropdown-item" onclick="rebootDevice('ubnt', '192.168.1.20')">
                        <i class="fa-solid fa-rotate"></i> إعادة تشغيل
                    </div>
                    <div class="dropdown-item" onclick="openInBrowser('http://192.168.1.20')">
                        <i class="fa-solid fa-external-link"></i> فتح في المتصفح
                    </div>
                </div>
                <div class="card-header"><i class="fa-brands fa-ubuntu"></i> طبق UBNT</div>
                <div class="card-body">
                    <div class="device-info">
                        <span><i class="fa-solid fa-network-wired"></i> IP: 192.168.1.20</span>
                        <span><i class="fa-solid fa-user-shield"></i> ubnt</span>
                    </div>
                    <div class="device-status offline"><i class="fa-solid fa-circle"></i> غير متصل</div>
                    <div class="device-stats">
                        <span><i class="fa-solid fa-arrow-up"></i> إرسال: <b>0 Mbps</b></span>
                        <span><i class="fa-solid fa-arrow-down"></i> استقبال: <b>0 Mbps</b></span>
                        <span><i class="fa-solid fa-signal"></i> الإشارة: <b>-80 dBm</b></span>
                    </div>
                </div>
            </div>
            <div class="device-card broadband">
                <button class="settings-btn">
                    <i class="fas fa-cog"></i>
                </button>
                <div class="settings-dropdown">
                    <div class="dropdown-item view-subscription">
                        <i class="fas fa-info-circle"></i> معلومات الاشتراك
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item text-danger" onclick="cancelSubscription('testuser')">
                        <i class="fas fa-ban"></i> إلغاء الاشتراك
                    </div>
                </div>
                <div class="card-header"><i class="fa-solid fa-user-plus"></i> يوزر برودباند</div>
                <div class="card-body">
                    <div class="device-info">
                        <span><i class="fa-solid fa-user"></i> اسم المستخدم: testuser</span>
                        <span><i class="fa-solid fa-server"></i> السيرفر: 192.168.88.1</span>
                    </div>
                    <div class="device-status online"><i class="fa-solid fa-circle"></i> مفعل</div>
                    <div class="device-stats">
                        <span><i class="fa-solid fa-gauge"></i> السرعة: <b>10 Mbps</b></span>
                        <span><i class="fa-solid fa-clock"></i> المدة: <b>30 يوم</b></span>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="js/dashboard.js"></script>
    <script>
    // تحديث التاريخ والوقت الفعلي
    function updateDateTime() {
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        document.getElementById('datetime').textContent = now.toLocaleString('ar-EG', options);
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();
    </script>
</body>
</html>