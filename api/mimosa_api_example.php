<?php
// مثال: الاتصال بجهاز Mimosa عبر REST API
// يتطلب تفعيل REST API على الجهاز
$ip = '192.168.1.10'; // عدل IP الجهاز
$user = 'admin';      // اسم المستخدم
$pass = 'admin123';   // كلمة المرور

$url = "https://$ip:443/api/v1/devices/self"; // مثال endpoint لجلب معلومات الجهاز

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_USERPWD, "$user:$pass");
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // فقط للاختبار
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // فقط للاختبار
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode == 200) {
    echo $response;
} else {
    echo json_encode(['success'=>false, 'msg'=>'فشل الاتصال بجهاز Mimosa','http_code'=>$httpcode]);
}
