$objShell = New-Object -ComObject Shell.Application 
$objFolder = $objShell.Namespace(0xA) 
$temp = get-ChildItem "env:\TEMP" 
$temp2 = $temp.Value 
$WinTemp = "c:\Windows\Temp\*" 
Remove-Item -Recurse  "$temp2\*" -Force -ea SilentlyContinue > $null
$objFolder.items() | %{ remove-item $_.path -Recurse -Confirm:$false} 
Remove-Item -Recurse $WinTemp -Force -ea SilentlyContinue > $null