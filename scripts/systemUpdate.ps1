$system=Get-WmiObject Win32_ComputerSystem
    $compType=""
    if($system.Manufacturer -eq 'LENOVO') {
        $compType="Lenovo"
        Write-Host "Installing Lenovo System Update ..."
        Start-Process "\\server\data\installs\LenovoSystemUpdate\systemupdate.exe" -ArgumentList "/silent /norestart" -Wait -NoNewWindow
        Write-Host "Done"
    }elseif($system.Manufacturer -eq 'Dell Inc.'){
        $compType="Dell"
        Write-Host "Installing Dell System Update ..."
        Start-Process "\\server\data\installs\DellSystemUpdate\Systems-Management_Application_4DP6N_WN32_2.1.1_A00.EXE" -ArgumentList "/s /f" -Wait -NoNewWindow
        Write-Host "Done"
    } else {
        $compType=$system.Manufacturer
    }