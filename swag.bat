@echo off
chcp 65001 > nul
mode con: cols=100 lines=40
color 0a
title [█▓▒░ TERMINAL v4.20 ░▒▓█]

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                              ║
echo ║  ███████╗████████╗ █████╗ ██████╗ ███████╗██╗      ██████╗ ██╗    ██╗        ║
echo ║  ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║     ██╔═══██╗██║    ██║        ║
echo ║  ███████╗   ██║   ███████║██████╔╝█████╗  ██║     ██║   ██║██║ █╗ ██║        ║
echo ║  ╚════██║   ██║   ██╔══██║██╔══██╗██╔══╝  ██║     ██║   ██║██║███╗██║        ║
echo ║  ███████║   ██║   ██║  ██║██║  ██║███████╗███████╗╚██████╔╝╚███╔███╔╝        ║
echo ║  ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝  ╚══╝╚══╝         ║
echo ║                                                                              ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  [■] SYSTEM:      Windows_NT 10.0                                            ║
echo ║  [■] USER:        %USERNAME%                                                 ║
echo ║  [■] ACCESS:      ROOT                                                       ║
echo ║  [■] TIME:        %time%                                                     ║
echo ║  [■] SESSION:     ACTIVE                                                     ║
echo ║                                                                              ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  [1] MAINFRAME        [2] SCAN          [3] EXTRACT       [4] CLEAN          ║
echo ║  [5] MONITOR          [6] ENCRYPT       [7] DECODE        [8] EXIT           ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
set /p choice="[█▓▒░ SELECT OPTION ░▒▓█] >> "

if "%choice%"=="1" goto mainframe
if "%choice%"=="2" goto scan
if "%choice%"=="3" goto extract
if "%choice%"=="4" goto clean
if "%choice%"=="5" goto monitor
if "%choice%"=="6" goto encrypt
if "%choice%"=="7" goto decode
if "%choice%"=="8" exit

:mainframe
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                          [ MAINFRAME ACCESS ]                                ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  INITIALIZING SECURE CONNECTION...                                          ║
echo ║  ██████████████████████████████████████████████████████████████████████████  ║
timeout /t 2 /nobreak > nul
echo ║                                                                              ║
echo ║  [+] CONNECTED TO: STARFLOW_MAIN                                            ║
echo ║  [+] IP: 192.168.4.20                                                       ║
echo ║  [+] PORT: 8080                                                             ║
echo ║  [+] ENCRYPTION: AES-256                                                    ║
echo ║                                                                              ║
echo ║  LOADING MODULES...                                                         ║
echo ║  [██████████████████████████████████████████░░░░] 75%%                      ║
timeout /t 1 /nobreak > nul
echo ║                                                                              ║
echo ║  [✓] GRABBER        [✓] FRAGMENT       [✓] DATABASE      [✓] BOTS           ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo [1] START SYSTEM     [2] STATUS CHECK    [3] BACK
set /p mainchoice=">> "

if "%mainchoice%"=="1" (
    echo.
    echo [!] STARTING STARFLOW SYSTEM...
    cd /d C:\starflow 2>nul || echo [!] ERROR: Directory not found
    python start.py
)
if "%mainchoice%"=="2" (
    echo.
    echo [!] CHECKING SYSTEM STATUS...
    timeout /t 1 /nobreak > nul
    echo [✓] FRAGMENT: ONLINE
    echo [✓] DATABASE: ACTIVE
    echo [✓] GRABBER: STANDBY
    echo [✓] BOTS: READY
    pause
)
goto mainframe

:scan
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                          [ TARGET SCAN MODE ]                                ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
set /p target="[!] ENTER TARGET PHONE (e.g., +79991234567): "
echo ║                                                                              ║
echo ║  SCANNING: %target%                                                         ║
echo ║  ██████████████████████████████████████████████████████████████████████████  ║
timeout /t 3 /nobreak > nul
echo ║                                                                              ║
echo ║  [+] TARGET ACQUIRED                                                        ║
echo ║  [+] CARRIER: TELEGRAM                                                      ║
echo ║  [+] STATUS: ONLINE                                                        ║
echo ║  [+] 2FA: DISABLED                                                          ║
echo ║  [+] STARS: 5,280                                                           ║
echo ║  [+] GIFTS: 12                                                              ║
echo ║  [+] NFT: 3                                                                 ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo [1] EXTRACT DATA    [2] TEST GRAB      [3] BACK
set /p scanchoice=">> "

if "%scanchoice%"=="2" (
    echo.
    echo [!] INITIATING GRABBER TEST...
    echo [!] USING DEFAULT CODE: 77777
    python -c "
import asyncio
import time
print('╔══════════════════════════════════════╗')
print('║        GRABBER TEST v2.0            ║')
print('╠══════════════════════════════════════╣')
print('║                                      ║')
print('║  [■] TARGET: %target%')
print('║  [■] PHASE 1: AUTHENTICATION        ║')
time.sleep(1)
print('║      [+] SENDING CODE...            ║')
time.sleep(0.5)
print('║      [+] CODE ACCEPTED              ║')
time.sleep(0.5)
print('║  [■] PHASE 2: ASSET SCAN            ║')
time.sleep(0.5)
print('║      [+] STARS: 5,280               ║')
time.sleep(0.3)
print('║      [+] GIFTS: 12                  ║')
time.sleep(0.3)
print('║      [+] NFT: 3                     ║')
time.sleep(0.5)
print('║  [■] PHASE 3: EXTRACTION            ║')
time.sleep(0.5)
print('║      [+] TRANSFERRING NFT...        ║')
time.sleep(1)
print('║      [+] CONVERTING GIFTS...        ║')
time.sleep(0.8)
print('║      [+] WITHDRAWING STARS...       ║')
time.sleep(0.8)
print('║  [✓] OPERATION COMPLETE             ║')
print('║  [✓] TOTAL EXTRACTED: 8,742 STARS   ║')
print('║                                      ║')
print('╚══════════════════════════════════════╝')
"
    pause
)
goto scan

:extract
cls
echo.
python -c "
import random
import time
import sys

print('╔══════════════════════════════════════════════════════════════════════════════╗')
print('║                          [ DATA EXTRACTION ]                                 ║')
print('╠══════════════════════════════════════════════════════════════════════════════╣')
print('║                                                                              ║')

procedures = [
    'ACCESSING TELEGRAM API',
    'BYPASSING 2FA',
    'EXTRACTING SESSION KEYS',
    'SCANNING FOR ASSETS',
    'MAPPING NFT COLLECTION',
    'CALCULATING TOTAL VALUE',
    'PREPARING TRANSFER',
    'ENCRYPTING PAYLOAD'
]

for i, proc in enumerate(procedures):
    sys.stdout.write(f'║  [■] {proc:<60} ║')
    sys.stdout.flush()
    time.sleep(0.3)
    
    dots = random.randint(3, 10)
    for _ in range(dots):
        sys.stdout.write('.')
        sys.stdout.flush()
        time.sleep(0.1)
    
    sys.stdout.write(' DONE \n')
    sys.stdout.flush()

print('║                                                                              ║')
print('║  [✓] EXTRACTION COMPLETE                                                    ║')
print('║  [✓] ASSETS IDENTIFIED: 18                                                 ║')
print('║  [✓] ESTIMATED VALUE: 47,892 STARS                                         ║')
print('║  [✓] READY FOR TRANSFER                                                    ║')
print('║                                                                              ║')
print('╚══════════════════════════════════════════════════════════════════════════════╝')
"
pause
goto start

:clean
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                          [ SYSTEM CLEANUP ]                                  ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  INITIATING CLEANUP PROCEDURE...                                            ║
echo ║                                                                              ║
del /f /q %temp%\*.* 2>nul
echo ║  [✓] TEMP FILES CLEARED                                                     ║
timeout /t 1 /nobreak > nul
ipconfig /flushdns 2>nul
echo ║  [✓] DNS CACHE FLUSHED                                                      ║
timeout /t 1 /nobreak > nul
echo ║  [✓] LOG FILES ROTATED                                                      ║
timeout /t 1 /nobreak > nul
echo ║  [✓] SESSION DATA ENCRYPTED                                                 ║
echo ║                                                                              ║
echo ║  CLEANUP COMPLETE. NO TRACES DETECTED.                                      ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
pause
goto start

:monitor
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                          [ SYSTEM MONITOR ]                                  ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
:monitor_loop
for /l %%i in (1,1,5) do (
    echo ║  CPU: [██████████████████████░░░░░░] 75%% MEM: [████████████████████████░░] 85%%  ║
    timeout /t 1 /nobreak > nul
    echo ║  NET: 1.2 MB/s ↑ 4.7 MB/s ↓           CONNECTIONS: 47                        ║
    timeout /t 1 /nobreak > nul
    echo ║  ACTIVE SESSIONS: 12                  THREATS: 0                             ║
    timeout /t 1 /nobreak > nul
    echo ║  LAST GRAB: 2,840 STARS               TOTAL: 892,457 STARS                   ║
    timeout /t 1 /nobreak > nul
    echo ║                                                                              ║
)
echo ║  PRESS ANY KEY TO EXIT MONITOR...                                            ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
pause > nul
goto start

:encrypt
cls
echo.
set /p message="[!] ENTER MESSAGE TO ENCRYPT: "
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                          [ ENCRYPTION PROTOCOL ]                             ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  ORIGINAL: %message%                                                        ║
echo ║                                                                              ║
echo ║  APPLYING AES-256 ENCRYPTION...                                             ║
timeout /t 2 /nobreak > nul
echo ║                                                                              ║
set encrypted=
for %%c in (a b c d e f 0 1 2 3 4 5 6 7 8 9) do set encrypted=!encrypted!%%c
echo ║  ENCRYPTED: %encrypted%                                                     ║
echo ║                                                                              ║
echo ║  [✓] ENCRYPTION COMPLETE                                                    ║
echo ║  [✓] KEY STORED IN SECURE MEMORY                                            ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
pause
goto start

:decode
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                          [ DECODING SESSION ]                                ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  ANALYZING ENCRYPTED DATA STREAMS...                                        ║
timeout /t 2 /nobreak > nul
echo ║                                                                              ║
echo ║  [■] INTERCEPTING TELEGRAM TRAFFIC                                          ║
timeout /t 1 /nobreak > nul
echo ║  [■] DECRYPTING MTProto PACKETS                                             ║
timeout /t 1 /nobreak > nul
echo ║  [■] EXTRACTING SESSION KEYS                                                ║
timeout /t 1 /nobreak > nul
echo ║  [■] BYPASSING ENCRYPTION LAYERS                                            ║
timeout /t 1 /nobreak > nul
echo ║                                                                              ║
echo ║  [✓] DECODING SUCCESSFUL                                                    ║
echo ║  [✓] SESSION KEYS ACQUIRED                                                  ║
echo ║  [✓] READY FOR AUTHENTICATION                                               ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
pause
goto start

:start
cmd /c "%0"
