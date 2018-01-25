$registryPath = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\"
$Name = "StateFlags0006"
$value = "2"
$dirArr = @("Active Setup Temp Folders", "BranchCache", "Downloaded Program Files", "Internet Cache Files", "Old ChkDsk Files", "RetailDemo Offline Content", "Previous Installations", "Recycle Bin", "Service Pack Cleanup", "Setup Log Files", "System error memory dump files", "System error minidump files", "Temporary Files", "Temporary Setup Files", "Update Cleanup", "Upgrade Discarded Files", "User file versions", "Windows Defender", "Windows Error Reporting Archive Files", "Windows Error Reporting Queue Files", "Windows Error Reporting System Archive Files", "Windows Error Reporting System Queue Files", "Windows Error Reporting Temp Files", "Windows ESD installation files", "Windows Upgrade Log Files")

foreach ($d in $dirArr) {
    IF(Test-Path "$registryPath$d"){
        New-ItemProperty -Path "$registryPath$d" -Name $name -Value $value -PropertyType DWORD -Force | Out-Null
    }
}
     
Start-Process -FilePath "cleanmgr" -ArgumentList "/sagerun:6" -Wait > $null
SchTasks /Create /SC WEEKLY /D SUN /TN "Disk Cleanup" /TR "cleanmgr /sagerun:6" /ST 01:00 > $null