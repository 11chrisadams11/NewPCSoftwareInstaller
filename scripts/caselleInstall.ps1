$ShortcutFile = "$env:Public\Desktop\Caselle Clarity.lnk"
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
$ShortCut.WorkingDirectory = "\\server\Caselle\CSLData"
$Shortcut.Save()

Sleep 2

Start-Process "$env:Public\Desktop\Caselle Clarity.lnk"  -Verb RunAs

Sleep 2 

$a = new-object -comobject wscript.shell
$a.SendKeys('{ENTER}')

Sleep 120

$a.SendKeys('{ENTER}')

Sleep 5

$a.SendKeys('%{f4}')