
Write-Host "Uninstalling Lenovo Crap..."
Write-Host ""
#$system=Get-WmiObject Win32_ComputerSystem
#if($system.Model -eq '10FLS18Y00') {
#    $remove = @("{46A84694-59EC-48F0-964C-7E76E9F8A2ED}", "{7D84E343-A23D-451C-B123-0195B2D903A6}", "{4B230374-6475-4A73-BA6E-41015E9C5013}", "{8D2C871B-1B9F-45AC-9C43-2BB18089CDFA}", "{B8D3ED8D-A295-44C2-8AE1-56823D44AD1F}", "{90150000-0138-0409-0000-0000000FF1CE}", "{DDAA788F-52E6-44EA-ADB8-92837B11BF26}")
#    $removeName = @("Lenovo Active Protection System", "Intel® Trusted Connect Service Client", "Intel® Security Assist", "Lenovo QuickOptimizer", "Lenovo BatteryGauge", "Microsoft Office", "Metric Collection SDK")
#} elseif($system.Model -eq 'T460s') {
#    $remove = @("{46A84694-59EC-48F0-964C-7E76E9F8A2ED}", "{7D84E343-A23D-451C-B123-0195B2D903A6}", "{4B230374-6475-4A73-BA6E-41015E9C5013}", "{8D2C871B-1B9F-45AC-9C43-2BB18089CDFA}", "{B8D3ED8D-A295-44C2-8AE1-56823D44AD1F}", "{90150000-0138-0409-0000-0000000FF1CE}", "{DDAA788F-52E6-44EA-ADB8-92837B11BF26}")
#    $removeName = @("Lenovo Active Protection System", "Intel® Trusted Connect Service Client", "Intel® Security Assist", "Lenovo QuickOptimizer", "Lenovo BatteryGauge", "Microsoft Office", "Metric Collection SDK")
#}
$remove = @(
    "{46A84694-59EC-48F0-964C-7E76E9F8A2ED}",
    "{7D84E343-A23D-451C-B123-0195B2D903A6}",
    "{4B230374-6475-4A73-BA6E-41015E9C5013}",
    "{8D2C871B-1B9F-45AC-9C43-2BB18089CDFA}",
    "{B8D3ED8D-A295-44C2-8AE1-56823D44AD1F}",
    "{90150000-0138-0409-0000-0000000FF1CE}",
    "{DDAA788F-52E6-44EA-ADB8-92837B11BF26}",
    "{324F76CC-D8DD-4D87-B77D-D4AF5E1AA7B3}",
    "{40BF1E83-20EB-11D8-97C5-0009C5020658}",
    "{4532E4C5-C84D-4040-A044-ECFCC5C6995B}",
    "{B46BEA36-0B71-4A4E-AE41-87241643FA0A}",
    "{B7A0CE06-068E-11D6-97FD-0050BACBF861}",
    "{C2B5B5B0-2545-4E94-B4BA-548D4BF0B196}",
    "{D6E853EC-8960-4D44-AF03-7361BB93227C}",
    "{DE485075-8CD3-4A1E-9ABC-6412EBA44872}",
    "{ED8800CE-3CD7-4A03-A28E-18AB8BDA4D39}",
    "{90160000-008F-0000-1000-0000000FF1CE}",
    "{90160000-008C-0000-0000-0000000FF1CE}",
    "{90160000-008C-0409-0000-0000000FF1CE}",
    "{DDAA788F-52E6-44EA-ADB8-92837B11BF26}"
)
$removeName = @(
    "Lenovo Active Protection System",
    "Intel® Trusted Connect Service Client",
    "Intel® Security Assist","Lenovo QuickOptimizer",
    "Lenovo BatteryGauge",
    "Microsoft Office",
    "Metric Collection SDK",
    "CyberLink WaveEditor",
    "CyberLink Power2Go 7",
    "REACHit",
    "CyberLink PowerDVD 12",
    "CyberLink PowerProducer 5.5",
    "Metric Collection SDK 35",
    "PowerDVD Create 10",
    "CyberLink",
    "Intel® Unite™",
    "Office 16 Click-to-Run Licensing Component",
    "Office 16 Click-to-Run Extensibility Component",
    "Office 16 Click-to-Run Localization Component",
    "Metric Collection SDK"
)
$count = 0

Write-Host "Uninstall Windows Bloatware"
taskkill /f /im OneDrive.exe
Start-Process "C:\Windows\SysWOW64\OneDriveSetup.exe" -ArgumentList "/uninstall" -Wait
Sleep 20

$removeWindowsCrap = @(
    "*messaging*",
    "*sway*",
    "*zune*",
    "*xboxapp*",
    "*solitaire*",
    "*officehub*",
    "*skypeapp*",
    "*3dbuilder*",
	"*3dviewer*",
    "*OneConnect*"
)

foreach ($r in $removeWindowsCrap) {
    get-appxpackage -allusers $r | remove-appxpackage
    Get-appxprovisionedpackage –online | where-object {$_.packagename –like "$r"} | remove-appxprovisionedpackage –online
    Sleep 30
}


Write-Host "Uninstall Office 365"
Start-Process "C:\Program Files\Common Files\Microsoft Shared\ClickToRun\OfficeClickToRun.exe" -ArgumentList "scenario=install scenariosubtype=uninstall productstoremove=O365HomePremRetail.16_en-us_x-none culture=en-us DisplayLevel=False" -Wait
Start-Process "C:\Program Files\Common Files\Microsoft Shared\ClickToRun\OfficeClickToRun.exe" -ArgumentList "scenario=install scenariosubtype=ARP sourcetype=None productstoremove=HomeStudentRetail.16_en-us_x-none culture=en-us" -Wait

foreach ($r in $remove) {
    Write-Host "Uninstall" $removeName[$count] 
    Start-Process "msiexec.exe" -ArgumentList "/X $r /qn /norestart" -Wait
    $count += 1
}

$a = new-object -comobject wscript.shell

$stupidApp = @(
	"{52753916-613B-4455-8022-A146CC17B1F6}",
	"{C1FC707B-AE6B-4DC4-89A5-6628A01F8103}",
	"{52753916-613B-4455-8022-A146CC17B1F6}",
	"{E442BFFD-8406-4C6D-BE7E-0CF6E61EE363}"
)

foreach ($s in $stupidApp) {
	$path = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\" + $s
	if(Test-Path $path){
		Write-Host "Uninstall Lenovo Solution Center" 
		Start-Process "msiexec.exe" -ArgumentList "/X $s /qn /norestart"
		Sleep 20
		$a.SendKeys('{ENTER}')
		Sleep 2
		$a.AppActivate('https://www.surveymonkey.com/s/LSCremove') > $null
		Sleep 2
		$a.SendKeys('{ENTER}')
		Sleep 20
	}
}

#$stupid = "{52753916-613B-4455-8022-A146CC17B1F6}"
#Write-Host "Uninstall Lenovo Solution Center" 
#Start-Process "msiexec.exe" -ArgumentList "/X $stupid /qn /norestart"
#Sleep 20
#$a.SendKeys('{ENTER}')
#Sleep 2
#$a.AppActivate('https://www.surveymonkey.com/s/LSCremove') > $null
#Sleep 2
#$a.SendKeys('{ENTER}')
#Sleep 20

if (Test-Path "C:\Program Files (x86)\Lenovo\PowerMgr\unins000.exe") {
    Write-Host "Uninstall Lenovo Power Manager"
    Start-Process "C:\Program Files (x86)\Lenovo\PowerMgr\unins000.exe" -ArgumentList "/SILENT" -Wait
}

if (Test-Path "C:\Program Files (x86)\Lenovo\SHAREit\unins000.exe") {
    Write-Host "Uninstall Lenovo SHAREit"
    Start-Process "C:\Program Files (x86)\Lenovo\SHAREit\unins000.exe" -ArgumentList "/SILENT" -Wait
}

if (Test-Path "C:\Program Files\McAfee\MSC\mcuihost.exe") {
    Write-Host "Uninstall McAfee LiveSafe"
    Start-Process "C:\Program Files\McAfee\MSC\mcuihost.exe" -ArgumentList "/body:misp://MSCJsRes.dll::uninstall.html /id:uninstall"
    Sleep 10
    $a.SendKeys('+{TAB}')
    Sleep 1
    $a.SendKeys('+{TAB}')
    Sleep 1
    $a.SendKeys(' ')
    Sleep 1
    $a.SendKeys('{TAB}')
    Sleep 1
    $a.SendKeys(' ')
    Sleep 1
    $a.SendKeys('{TAB}')
    Sleep 1
    $a.SendKeys('{TAB}')
    Sleep 1
    $a.SendKeys('{ENTER}')
    Sleep 2
    $a.SendKeys('{ENTER}')
    Sleep 300
    $a.SendKeys('{TAB}')
    Sleep 1
    $a.SendKeys('{ENTER}')
}
#Restart-Computer