New-Item C:\tools -type directory > $null
copy "\\server\data\installs\systeminfo.exe" "C:\tools\"
$TargetFile = "C:\tools\systeminfo.exe"
$ShortcutFile = "$env:Public\Desktop\System Info.lnk"
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutFile)
$Shortcut.TargetPath = $TargetFile
$ShortCut.Arguments = "/no_public_ip /no_url"
$ShortCut.WorkingDirectory = "C:\tools\"
$ShortCut.Hotkey = "CTRL+SHIFT+I";
$ShortCut.Description = "Get information about your computer";
$Shortcut.Save()