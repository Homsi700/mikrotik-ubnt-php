<?php
// جلب بيانات جميع الأجهزة بشكل حقيقي من نوعها (مايكروتك، ميموزا، UBNT)
header('Content-Type: application/json; charset=utf-8');
$devices = [];
$file = '../devices.json';
if (file_exists($file)) {
    $devices = json_decode(file_get_contents($file), true);
}

$result = [];
foreach ($devices as $device) {
    $type = $device['type'] ?? '';
    if ($type === 'mikrotik') {
        // جلب حالة مايكروتك
        $ip = $device['ip'] ?? '';
        $user = $device['username'] ?? '';
        $pass = $device['password'] ?? '';
        $api_url = "device_status_router.php?ip=$ip&user=$user&pass=$pass";
        $data = @file_get_contents($api_url);
        $status = $data ? json_decode($data, true) : null;
        $device['status'] = $status && $status['success'] ? 'online' : 'offline';
        $device['users'] = $status['active_users'] ? count($status['active_users']) : 0;
        $device['tx'] = $status['interfaces'][0]['tx-byte'] ?? 0;
        $device['rx'] = $status['interfaces'][0]['rx-byte'] ?? 0;
        // منطق الإنذار
        $limit = isset($device['speed_limit']) ? (int)$device['speed_limit'] : 0;
        $device['alert'] = ($device['tx'] > $limit*1024*1024 || $device['rx'] > $limit*1024*1024);
        $device['alertMsg'] = $device['alert'] ? 'تجاوز حد السرعة!' : '';
        $result[] = $device;
    } elseif ($type === 'mimosa') {
        // جلب حالة ميموزا
        $ip = $device['ip'] ?? '';
        $user = $device['username'] ?? '';
        $pass = $device['password'] ?? '';
        $api_url = "device_status_mimosa.php?ip=$ip&user=$user&pass=$pass";
        $data = @file_get_contents($api_url);
        $status = $data ? json_decode($data, true) : null;
        $device['status'] = $status && isset($status['status']) ? 'online' : 'offline';
        $device['signal'] = $status['signal'] ?? ($status['device']['signal'] ?? null);
        $device['tx'] = $status['tx'] ?? 0;
        $device['rx'] = $status['rx'] ?? 0;
        // منطق الإنذار
        $signal_limit = isset($device['signal_limit']) ? (int)$device['signal_limit'] : -70;
        $device['alert'] = ($device['signal'] !== null && $device['signal'] < $signal_limit);
        $device['alertMsg'] = $device['alert'] ? 'الإشارة ضعيفة جداً!' : '';
        $result[] = $device;
    } elseif ($type === 'ubnt') {
        // جلب حالة UBNT (محاكاة SNMP/HTTP)
        // يمكنك لاحقاً ربط SNMP أو API حقيقي هنا
        $device['status'] = 'online'; // محاكاة
        $device['signal'] = -65;
        $device['tx'] = 20;
        $device['rx'] = 30;
        $signal_limit = isset($device['signal_limit']) ? (int)$device['signal_limit'] : -70;
        $device['alert'] = ($device['signal'] < $signal_limit);
        $device['alertMsg'] = $device['alert'] ? 'الإشارة ضعيفة جداً!' : '';
        $result[] = $device;
    } elseif ($type === 'broadband') {
        // بطاقة يوزر برودباند (محاكاة)
        $device['status'] = 'online';
        $result[] = $device;
    }
}
echo json_encode($result, JSON_UNESCAPED_UNICODE);
