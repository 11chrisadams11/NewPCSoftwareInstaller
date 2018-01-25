if ([System.IntPtr]::Size -eq 4) { 
    #32-bit
    Write-Host "Installing Global Protect 32 bit ..."
    Start-Process 'msiexec' -ArgumentList '/i \\server\DATA\Installs\GlobalProtectClients\GlobalProtect.msi /qb /norestart' -Wait -Verb RunAs
} else { 
    #64-bit 
    Write-Host "Installing Global Protect 64 bit ..."
    Start-Process 'msiexec' -ArgumentList '/i \\server\DATA\Installs\GlobalProtectClients\GlobalProtect64.msi /qb /norestart' -Wait -Verb RunAs       
}
Sleep 10
$a = new-object -comobject wscript.shell
$a.AppActivate('GlobalProtect') > $null
Sleep 2
 Add-Type @"
   using System;
   using System.Runtime.InteropServices;
   public class Tricks {
     [DllImport("user32.dll")]
     public static extern IntPtr GetForegroundWindow();
 }
"@

$c = [tricks]::GetForegroundWindow()
$b = get-process | ? { $_.mainwindowhandle -eq $c }
if ($b.name -eq 'PanGPA'){
    $a.SendKeys('%')
    Sleep 1
    $a.SendKeys('{ENTER}')
    Sleep 1
    $a.SendKeys('c')
    Sleep 2
} else {
    $a.AppActivate('GlobalProtect') > $null
    Sleep 2
    $c = [tricks]::GetForegroundWindow()
    $b = get-process | ? { $_.mainwindowhandle -eq $c }
    if ($b.name -eq 'PanGPA'){
        $a.SendKeys('%')
        Sleep 1
        $a.SendKeys('{ENTER}')
        Sleep 1
        $a.SendKeys('c')
        Sleep 2
    }
}