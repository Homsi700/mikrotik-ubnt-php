<?php
// إعدادات الاتصال بالمايكروتك
define('MIKROTIK_IP', '192.168.1.1'); // قم بتغيير هذا إلى عنوان IP الخاص بجهاز المايكروتك
define('MIKROTIK_USERNAME', 'admin'); // قم بتغيير هذا إلى اسم المستخدم الخاص بك
define('MIKROTIK_PASSWORD', ''); // قم بتغيير هذا إلى كلمة المرور الخاصة بك
define('MIKROTIK_PORT', 8728); // المنفذ الافتراضي للمايكروتك API

// إعدادات الاتصال بجهاز Mimosa
define('MIMOSA_IP', '192.168.1.2'); // قم بتغيير هذا إلى عنوان IP الخاص بجهاز Mimosa
define('MIMOSA_USERNAME', 'admin'); // قم بتغيير هذا إلى اسم المستخدم الخاص بك
define('MIMOSA_PASSWORD', ''); // قم بتغيير هذا إلى كلمة المرور الخاصة بك

// إعدادات عامة
define('UPDATE_INTERVAL', 30); // الفترة الزمنية بالثواني لتحديث البيانات

// دالة للتحقق من صحة الاتصال
function testConnection($ip, $port = 80) {
    $connection = @fsockopen($ip, $port, $errno, $errstr, 5);
    if ($connection) {
        fclose($connection);
        return true;
    }
    return false;
}
?>