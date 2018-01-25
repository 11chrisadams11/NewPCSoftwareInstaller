$encrypted = "I'm Batman"
[Byte[]] $key = (1..16)
$Password = ConvertTo-SecureString -string $encrypted -key $key
$temporaryCredential = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password))
$ComputerName = 'localhost' 
$objUser = [ADSI]"WinNT://$ComputerName/Administrator, user"
$objUser.psbase.Invoke("SetPassword", $temporaryCredential)
$objUser.userflags = 66048
$objUser.setinfo()