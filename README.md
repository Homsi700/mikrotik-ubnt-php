 نظام إدارة أجهزة MikroTik و Ubiquiti

![صورة واجهة النظام](https://via.placeholder.com/800x400?text=MikroTik+UBNT+Dashboard)

نظام متكامل لإدارة وتتبع أجهزة MikroTik و Ubiquiti مع لوحة تحكم سهلة الاستخدام.

## المميزات الرئيسية

✅ **إدارة مركزية** لكل الأجهزة  
✅ **مراقبة في الوقت الحقيقي** للحالة والأداء  
✅ **تقارير مفصلة** عن استخدام النطاق الترددي  
✅ **تنبيهات تلقائية** عند وجود مشاكل  
✅ **واجهة مستخدم بديهية** وسهلة الاستخدام  

## متطلبات التشغيل

- خادم ويب (Apache/Nginx)
- PHP 7.4 أو أحدث
- MySQL 5.7+/MariaDB
- اتصال SSH بالأجهزة
- Composer (لتركيب المكتبات)

## طريقة التركيب

1. نسخ المستودع:
```bash
git clone https://github.com/Homsi700/mikrotik-ubnt-php.git
cd mikrotik-ubnt-php
تركيب المكتبات:

bash
composer install
إعداد قاعدة البيانات:

bash
mysql -u root -p < database/schema.sql
تعديل إعدادات الاتصال:

php
// config.php
define('DB_HOST', 'localhost');
define('DB_USER', 'username');
define('DB_PASS', 'password');
define('DB_NAME', 'mikrotik_ubnt');
تشغيل النظام:

bash
php -S localhost:8000
هيكل المشروع
mikrotik-ubnt-php/
├── assets/        # ملفات CSS و JS
├── config/        # ملفات الإعدادات
├── controllers/   # المتحكمات
├── models/        # نماذج البيانات
├── views/         # واجهات المستخدم
├── scripts/       # سكربتات الخلفية
└── database/      # ملفات قاعدة البيانات
أمثلة الاستخدام
إضافة جهاز جديد
php
$device = new Device();
$device->add([
    'ip' => '192.168.1.1',
    'username' => 'admin',
    'password' => 'securepass',
    'type' => 'mikrotik'
]);
جلب بيانات الجهاز
php
$router = new MikroTik('192.168.1.1');
$interfaces = $router->getInterfaces();
$traffic = $router->getTraffic();
المساهمة في المشروع
انسخ المشروع (Fork)

أنشئ فرعًا جديدًا (git checkout -b feature/new-feature)

أضف تعديلاتك وأرسلها (Commit)

ادفع التغييرات (Push)

افتح طلب دمج (Pull Request)

الرخصة
هذا المشروع مرخص تحت رخصة MIT.

الدعم والاتصال
للأسئلة أو المشاكل، يرجى فتح طلب مساعدة أو التواصل عبر البريد الإلكتروني: youremail@example.com

✨ مبروك! أنت الآن جاهز لبدء استخدام النظام.
