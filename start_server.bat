@echo off
REM تشغيل سيرفر PHP المدمج وفتح المتصفح تلقائياً
cd /d %~dp0
start "" php\php.exe -S localhost:8080

ping 127.0.0.1 -n 3 > nul
start "" http://localhost:8080/index.php
