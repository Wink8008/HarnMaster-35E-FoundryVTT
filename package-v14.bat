@echo off
setlocal

REM ============================================================
REM HarnMaster 3.5 Enhanced - Foundry V14 Release Builder
REM ============================================================

set VERSION=1.0.1
set SYSTEM=hm3
set RELEASEDIR=releases\v%VERSION%
set STAGEDIR=%RELEASEDIR%\hm3

echo.
echo ============================================================
echo HarnMaster 3.5 Enhanced - Foundry V14 Package Builder
echo Version %VERSION%
echo ============================================================
echo.

REM ------------------------------------------------------------
REM Remove previous build
REM ------------------------------------------------------------

if exist "%RELEASEDIR%" (
    echo Removing previous release...
    rmdir /s /q "%RELEASEDIR%"
)

mkdir "%STAGEDIR%"

REM ------------------------------------------------------------
REM Rebuild compendium packs
REM ------------------------------------------------------------

echo.
echo Rebuilding compendium packs...
echo.

call build-packs.bat

if errorlevel 1 (
    echo.
    echo ERROR: Compendium build failed.
    pause
    exit /b 1
)

REM ------------------------------------------------------------
REM Copy release directories
REM ------------------------------------------------------------

echo.
echo Copying system directories...
echo.

xcopy "audio" "%STAGEDIR%\audio\" /E /I /Q /Y
xcopy "css" "%STAGEDIR%\css\" /E /I /Q /Y
xcopy "fonts" "%STAGEDIR%\fonts\" /E /I /Q /Y
xcopy "images" "%STAGEDIR%\images\" /E /I /Q /Y
xcopy "lang" "%STAGEDIR%\lang\" /E /I /Q /Y
xcopy "module" "%STAGEDIR%\module\" /E /I /Q /Y
xcopy "packs" "%STAGEDIR%\packs\" /E /I /Q /Y
xcopy "templates" "%STAGEDIR%\templates\" /E /I /Q /Y
xcopy "ui" "%STAGEDIR%\ui\" /E /I /Q /Y

REM ------------------------------------------------------------
REM Copy required root files
REM ------------------------------------------------------------

echo.
echo Copying system files...
echo.

copy /Y "LICENSE" "%STAGEDIR%\LICENSE"
copy /Y "README.md" "%STAGEDIR%\README.md"
copy /Y "system.json" "%STAGEDIR%\system.json"
copy /Y "template.json" "%STAGEDIR%\template.json"

REM ------------------------------------------------------------
REM Copy manifest to release directory
REM ------------------------------------------------------------

copy /Y "system.json" "%RELEASEDIR%\system.json"

REM ------------------------------------------------------------
REM Create ZIP
REM ------------------------------------------------------------

echo.
echo Creating release ZIP...
echo.

powershell -NoProfile -Command ^
    "Compress-Archive -Path '%STAGEDIR%\*' -DestinationPath '%RELEASEDIR%\hm3-%VERSION%.zip' -Force"

if errorlevel 1 (
    echo.
    echo ERROR: ZIP creation failed.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo BUILD COMPLETE
echo ============================================================
echo.
echo Release directory:
echo %CD%\%RELEASEDIR%
echo.
echo ZIP:
echo %CD%\%RELEASEDIR%\hm3-%VERSION%.zip
echo.
echo Manifest:
echo %CD%\%RELEASEDIR%\system.json
echo.

pause