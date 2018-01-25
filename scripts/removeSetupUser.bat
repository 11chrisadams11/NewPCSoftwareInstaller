net users | find /I "setup"
if %errorlevel% equ 0 (
    NET USER SETUP /DELETE /Y 2>nul
) else (
 ECHO 'not found'
)
