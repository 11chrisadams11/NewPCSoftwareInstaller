copy '\\server\DATA\Installs\TFC.exe' 'c:\' 
Start-Process 'c:\TFC.exe' -Verb RunAs
$a = new-object -comobject wscript.shell
$a.SendKeys('{ENTER}')
Sleep 1
$a.AppActivate('TFC') > $null
Sleep 1
$a.SendKeys('{ENTER}')
Sleep 60
$a.AppActivate('File Explorer') > $null
Sleep 1
$a.SendKeys('%{f4}')
Sleep 4
$a.SendKeys('{ENTER}')
Sleep 5