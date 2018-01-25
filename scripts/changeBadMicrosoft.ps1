# Disable Telemetry
Set-ItemProperty -Path HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection -Name AllowTelemetry -Type DWord -Value 0 | Out-Null
Get-Service DiagTrack,Dmwappushservice | Stop-Service | Set-Service -StartupType Disabled | Out-Null
# WiFi Sense: HotSpot Sharing: Disable
#Set-ItemProperty -Path HKLM:\Software\Microsoft\PolicyManager\default\WiFi\AllowWiFiHotSpotReporting -Name value -Type DWord -Value 0 | Out-Null
# WiFi Sense: Shared HotSpot Auto-Connect: Disable
Set-ItemProperty -Path HKLM:\Software\Microsoft\PolicyManager\default\WiFi\AllowAutoConnectToWiFiSenseHotspots -Name value -Type DWord -Value 0 | Out-Null
# Disable P2P Update downlods outside of local network
Set-ItemProperty -Path HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\DeliveryOptimization\Config -Name DODownloadMode -Type DWord -Value 1 | Out-Null

Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\tzautoupdate -Name Start -Type DWord -Value 4 | Out-Null
Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Control\TimeZoneInformation -Name TimeZoneKeyName -Type String -Value 'Mountain Standard Time' | Out-Null