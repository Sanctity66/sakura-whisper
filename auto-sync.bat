@echo off
chcp 65001 >nul
title Sakura Whisper - 自动同步监控

echo ========================================
echo   自动同步已启动
echo   每隔 5 分钟检查并同步一次
echo   按 Ctrl+C 停止监控
echo ========================================
echo.

:loop
:: 获取当前时间
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set current_time=%datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%

:: 检查是否有修改
git status --short > nul 2>&1
git diff-index --quiet HEAD --

if %errorlevel% neq 0 (
    echo [%current_time%] 检测到文件修改,正在同步...
    git add .
    git commit -m "自动同步 - %date% %current_time%"
    git push
    echo [%current_time%] 同步完成
    echo.
) else (
    echo [%current_time%] 没有文件修改,跳过本次同步
)

:: 等待 5 分钟 (300 秒)
timeout /t 300 /nobreak >nul
goto loop
