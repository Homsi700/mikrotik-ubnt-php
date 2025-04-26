<?php
// مثال: الاتصال بسيرفر MikroTik عبر RouterOS API
// تحتاج مكتبة routeros-api (https://github.com/BenMenking/routeros-api)
require_once __DIR__ . '/routeros_api.class.php';

$ip = '192.168.88.1'; // عدل IP السيرفر
$user = 'admin';      // اسم المستخدم
$pass = 'admin123';   // كلمة المرور

$API = new RouterosAPI();
if ($API->connect($ip, $user, $pass)) {
    // جلب المستخدمين المتصلين كمثال
    $API->write('/ppp/active/print');
    $users = $API->read();
    $API->disconnect();
    echo json_encode(['success'=>true, 'users'=>$users], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['success'=>false, 'msg'=>'فشل الاتصال بسيرفر مايكروتك']);
}
