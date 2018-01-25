var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = new require('socket.io')(http);
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var sleep = require('system-sleep');
var fs = require('fs');

var laptop = false,
    popo = false,
    popoCam = false,
    caselle = false,
    vlc = false,
    xprotect = false,
    dropbox = false,
    eFileCabinet = false,
    googleEarth = false,
    progressCount = 0,
    installCount = 1,
    stepCount = 1,
    settingsFile = 'C:\\install\\install.txt',
    cl = console.log;

function startChrome(){
    exec('"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" 127.0.0.1:3000');
}

cl(__dirname)
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
	setTimeout(function(){
		startChrome();
	}, 5000)
    cl('listening on *:3000 - ' + new Date());
});

io.on('connection', function(socket){
    socket.on('goButton', function(data){
        if (fs.existsSync(settingsFile)) {
            runInstalls(laptop, popo, popoCam)
        } else {
            if (!(fs.existsSync('c:\\install'))){
                execSync('mkdir c:\\install');
            }
            execSync('copy /Y "\\\\server\\data\\installs\\00newComputerSetup\\files\\DefaultLayouts.xml" "C:\\Users\\Default\\AppData\\Local\\Microsoft\\Windows\\Shell"');
            execSync('powershell -ExecutionPolicy Bypass -command \"Import-StartLayout -layoutpath \'\\\\server\\data\\installs\\00newComputerSetup\\files\\LayoutFile.xml\' -Mountpath C:\\\\"');
            laptop = data.laptop;
            popo = data.popo;
            popoCam = data.popoCam;
            caselle = data.caselle;
            vlc = data.vlc;
            xprotect = data.xprotect;
            dropbox = data.dropbox;
            eFileCabinet = data.eFileCabinet;
            googleEarth = data.googleEarth;
            writeInstallFile(progressCount);
            runInstalls()
        }
    })
    .on('init', function() {
        sleep(2000);
        if (fs.existsSync(settingsFile)) {
            fs.readFile(settingsFile, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                } else {
                    var set = JSON.parse(data);
                    progressCount = set.count;
                    laptop = set.laptop;
                    popo = set.popo;
                    popoCam = set.popoCam;

                    io.emit('setContinueSwitches', [laptop, popo, popoCam]);
                    sleep(1000);
                    sendInfo('Install file found. Click to continue.', false);
                }
            });
        } else {
            io.emit('goButton', true)
        }
    })
    .on('reboot', function() {
        execSync('powershell -ExecutionPolicy Bypass -command "Sleep 3; Restart-Computer"');
    })
    .on('reinstall', function(data) {
        installers.forEach(function(e){
            if (e.name.toString() === data){
                if(typeof e === 'function'){
                    e()
                } else {
                    e.install(true)
                }
            }
        })
    })
});



function sendInfo(info, append){
    io.emit('info', [info, append])
}

function sendInfoDone (success, name){
    io.emit('infoDone', [success, name])
}

function sendProgress(){
    var p = (installCount / stepCount) * 100;
    io.emit('progress', parseInt(p))
}

function writeInstallFile(no){
    var obj = {
            count: no,
            laptop: laptop,
            popo: popo,
            popoCam: popoCam
        };
    fs.writeFile(settingsFile, JSON.stringify(obj), function (err) {
        if (err) {
            return console.log("Error writing settings file: " + err);
        }
    });
}

function runInstalls() {
    io.emit('goButton', false);
    installCount = 1;

    installers.forEach(function(e){
        if(typeof e === 'function'){
            e()
        } else {
            e.install()
        }
        sendProgress();
        installCount++;

        try {
            exec('tasklist | find /I "chrome"', function(e, sout){
                if(sout === ''){
                    startChrome();
                    sleep(10000)
                }
            })
        } catch (q) {
            startChrome();
            sleep(10000)
        }

    });

    execSync('powershell -ExecutionPolicy Bypass -command "Remove-Item C:\\install -recurse"');
    progressCount = 0;
    io.emit('rebootShow', true);
    cl("All Steps Complete - Reboot to Finish")
}

function Installer(name, info, steps, dir, restrictedTo, timeout) {
    this.name = name;
    this.info = info;
    this.steps = steps;
    this.dir = dir;
    this.restrictedTo = restrictedTo;
    this.timeout = timeout;
}

Installer.prototype.install = function(reinstall=false){
    var skip = false;
    switch (this.restrictedTo) {
        case 'laptop':
            if (!laptop) {skip = true}
            break;
        case 'popo':
            if (!popo) {skip = true}
            break;
        case 'notPopo':
            if (popo) {skip = true}
            break;
        case 'popoCam':
            if (!popoCam) {skip = true}
            break;
        case 'caselle':
            if (!caselle) {skip = true}
            break;
        case 'vlc':
            if (!popo && !vlc) {skip = true}
            break;
        case 'xprotect':
            if(!xprotect) {skip = true}
            break;
        case 'dropbox':
            if(!dropbox) {skip = true}
            break;
        case 'eFileCabinet':
            if(!eFileCabinet) {skip = true}
            break;
        case 'googleEarth':
            if(!googleEarth) {skip = true}
            break;
    }

    if (progressCount < installCount) {
        if (!skip){
            sendInfo(this.info, true);
            sleep(1000);
            try {
                this.steps.forEach(function(e){
                    if(this.timeout > 0) {
                        execSync(e, {timeout: this.timeout});
                    } else {
                        execSync(e);
                    }
                });
                sleep(1000);
                if (this.dir.length > 0) {
                    var found = false;
                    this.dir.forEach(function(i){
                        if(fs.existsSync(i)) {
                            found = true;
                        }
                    });

                    sendInfoDone(found, this.name);
                } else {
                    sendInfoDone(true, this.name);
                }
            } catch (e) {
                sendInfoDone(false, this.name);
            }
        }
        if (!reinstall){
            writeInstallFile(++progressCount);
        }
        sleep(2000);
    }
};

var removeSetupUser = new Installer('removeSetupUser',
    'Removing SETUP user',
    ['\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\removeSetupUser.bat'],
    []);

var setAdminPass = new Installer('setAdminPass',
    'Setting Admin Password',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\setAdminPass.ps1"'],
    []);

var removeCrap = function(){
    if (progressCount < installCount) {
        sendInfo('Removing Crapware', true);
        sleep(1000);
        var removeWindowsCrap = [
            "*messaging*",
            "*sway*",
            "*zune*",
            "*xboxapp*",
            "*solitaire*",
            "*officehub*",
            "*skypeapp*",
            "*3dbuilder*",
            "*3dviewer*",
            "*OneConnect*",
            "*Duolingo*",
            "*NetworkSpeedTest*",
            "*Pandora*",
            "*AdobePhotoshopExpress*",
            "*ActiproSoftwareLLC*",
            "*EclipseManager*",
            "*PowerBIForWindows*",
            "*Office.Sway*"
        ];

        removeWindowsCrap.forEach(function (e) {
            try {
                execSync('powershell -ExecutionPolicy Bypass -command "get-appxpackage -allusers ' + e + ' | remove-appxpackage > $null"');
			} catch (e) {}
            try {
                execSync('powershell -ExecutionPolicy Bypass -command "Get-appxprovisionedpackage –online | where-object {$_.packagename –like \'' + e + '\'} | remove-appxprovisionedpackage –online > $null"');
            } catch (e) {}
        });

        sleep(1000);
        sendInfoDone(true, 'removeCrap');
        writeInstallFile(++progressCount);
        sleep(2000);
    }
};

var turnOffSleep = new Installer('turnOffSleep',
    'Setting sleep settings', [
    'powercfg -change -standby-timeout-ac 0',
    'powercfg -change -standby-timeout-dc 0',
    'powercfg -change -monitor-timeout-ac 30',
    'powercfg -setdcvalueindex SCHEME_CURRENT 4f971e89-eebd-4455-a8de-9e59040e7347 5ca83367-6e45-459f-a27b-476b1d01c936 0',
    'powercfg -setacvalueindex SCHEME_CURRENT 4f971e89-eebd-4455-a8de-9e59040e7347 5ca83367-6e45-459f-a27b-476b1d01c936 0'
], []);

var turnOffSystemProtection = new Installer('turnOffSystemProtection',
    'Turning Off System Protection',
    ['powershell -ExecutionPolicy Bypass -command " Disable-ComputerRestore -Drive C:"'],
    []);

var changeBadMicrosoft = new Installer('changeBadMicrosoft',
    'Fixing Microsoft\'s bad decisions',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\changeBadMicrosoft.ps1"'],
    []);

var installSystemInfo = new Installer('installSystemInfo',
    'Installing SystemInfo',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\systeminfo.ps1"'],
    []);

var installMeraki = new Installer('installMeraki',
    'Installing Meraki System Manager',
    ['msiexec /i "\\\\server.gov\\data\\Installs\\MerakiSM\\MerakiSM-Agent-systems-manager.msi" /qb /norestart'],
    ['C:\\Program Files (x86)\\Meraki']);

var installOffice = new Installer('installOffice',
    'Installing Office 2016 STD',
    ['"\\\\server\\data\\installs\\Microsoft Office\\OFFICE2016STD\\setup.exe" /config "\\\\server\\data\\installs\\Microsoft Office\\OFFICE2016STD\\autoInstall.xml"'],
    ['C:\\Program Files (x86)\\Microsoft Office\\Office16\\OUTLOOK.EXE', 'C:\\Program Files\\Microsoft Office\\Office16\\OUTLOOK.EXE'],
    (1000 * 60 * 8));

var installSystemUpdate = new Installer('installSystemUpdate',
    'Installing System Update',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\systemUpdate.ps1"'],
    ['C:\\Program Files (x86)\\Lenovo\\System Update\\tvsu.exe', 'C:\\Program Files (x86)\\Dell\\ClientSystemUpdate', 'C:\\Program Files\\Dell\\ClientSystemUpdate']);

var installVipreClient = new Installer('installVipreClient',
    'Installing Vipre Client',
    ['msiexec /i "\\\\server.gov\\DATA\\Installs\\ViperClient\\AgentInstaller-Default-EN.MSI" /qb /norestart'],
    ['C:\\Program Files (x86)\\VIPRE Business Agent\\SBAMTray.exe', 'C:\\Program Files\\VIPRE Business Agent\\SBAMTray.exe']);

var installGlobalProtect = new Installer('installGlobalProtect',
    'Installing Global Protect',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\installGlobalProtect.ps1"'],
    ['C:\\Program Files\\Palo Alto Networks\\GlobalProtect\\PanGPA.exe'],
    'laptop');

var installAcrobatDC = new Installer('installAcrobatDC',
    'Installing Adobe Acrobat DC',
    ['\\\\server.gov\\DATA\\Installs\\AdobeAcrobatDC\\AcroRdrDC1700920044_en_US.exe /sPB /rs /msi TRANSFORMS=\\\\server.gov\\DATA\\Installs\\AdobeAcrobatDC\\install.mst'],
    ['C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe', 'C:\\Program Files\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe'],
    'notPopo');

var installMXIE = new Installer('installMXIE',
    'Installing MXIE',
    ['msiexec /i \\\\server.gov\\DATA\\Installs\\Zultys\\MXIE\\mxie64-12.0.7.msi /qb /norestart'],
    ['C:\\Program Files (x86)\\Zultys\\MXIE\\Bin\\mxie.exe']);

var installWinDirStat = new Installer('installWinDirStat',
    'Installing WinDirStat',
    ['\\\\server\\DATA\\Installs\\windirstat1_1_2_setup.exe /S'],
    ['C:\\Program Files (x86)\\WinDirStat\\windirstat.exe']);

var installNet35 = new Installer('installNet35',
    'Installing Windows 10 .Net 3.5',
    ['DISM /Online /Enable-Feature /FeatureName:NetFx3 /All /LimitAccess /Source:"\\\\server\\data\\Installs\\Windows_10_Net_35_Installer\\sxs"'],
    []);

//  --== Popo Installs ==--
var installVievu = new Installer('installVievu',
    'Installing VIEVU',
    ['"\\\\server\\data\\Installs\\VIEVU\\VERIPATROL Software\\VERIPATROL_Network_Install_4.18.12.2.exe"'],
    ['C:\\Program Files (x86)\\VIEVU VERIPATROL\\Bin\\ClientApp.exe'],
    'popo');

var installEasyStreet = new Installer('installEasyStreet',
    'Installing EasyStreet Draw',
    ['"\\\\server\\data\\Installs\\LPD_EZ_Street\\ESD6-1-2780.exe" /install /passive /norestart'],
    ['C:\\Program Files (x86)\\A-TSolutions\\Easy Street Draw 6\\Desktop\\ESDraw.exe'],
    'popo');

var installSpillman = new Installer('installSpillman',
    'Installing Spillman',
    ['"\\\\server\\DATA\\Installs\\Spillman\\spillman6.3full.exe" /S',
    '"\\\\server.gov\\DATA\\Installs\\AdobeAcrobatDC\\AcroRdrDC1700920044_en_US.exe" /sPB /rs /msi TRANSFORMS=\\\\server.gov\\DATA\\Installs\\AdobeAcrobatDC\\install.mst',
    'C:\\Windows\\System32\\reg add "HKEY_CURRENT_USER\\Software\\Adobe\\Acrobat Reader\\DC\\Privileged" /v "bProtectedMode" /t REG_DWORD /d 0 /f'],
    ["C:\\ProgramData\\Spillman\\Spillman\\application\\Spillman.exe"],
    'popo');

var installVLC = new Installer('installVLC',
    'Installing VLC',
    ['\\\\server.gov\\data\\installs\\VLC\\vlc-install.exe /L=1033 /S'],
    ["C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe"],
    'vlc');

var installArbitrator = new Installer('installArbitrator',
    'Installing Arbitrator 360',
    ['msiexec /i \\\\americop\\install\\FESetup.msi /qb /norestart'],
    ["C:\\Program Files (x86)\\Panasonic\\ICV\\FE\\ICV_FE.exe"],
    'popoCam');

var installGPSDrivers = new Installer('installGPSDrivers',
    'Installing Police GPS Drivers',
    ['"\\\\server\\data\\Installs\\Police GPS Drivers BU-353S4\\PL2303_Prolific_DriverInstaller_v1417.exe" /S'],
    [],
    'popo');

var runWindowsUpdate = new Installer('runWindowsUpdate',
    'Running Windows Update',
    ['xcopy /Y "\\\\server\\data\\installs\\00newComputerSetup\\files\\PSWindowsUpdate\\*" "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\PSWindowsUpdate\\*"',
    'powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\windowsUpdate.ps1"'],
    []);

/*stepCount++;
var runTFC = new Installer('runTFC',
    'Running TFC',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\tfc.ps1"',
    '"C:\\Program Files (x86)\\TeamViewer\\TeamViewer.exe"'],
    []);*/

var cleanUpDisk = new Installer('cleanUpDisk',
    'Cleaning up',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\cleanDisk.ps1"'],
    []);

var runCleanmgr = new Installer('runCleanmgr',
    'Running Disk Cleanup and setting schedule',
    ['powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\runCleanmgr.ps1"'],
    []);

var optimizeDrive = new Installer('optimizeDrive',
    'Optimizing drive',
    ['\\\\server\\data\\Installs\\00newComputerSetup\\files\\Programs\\cleanafterme.exe /clean',
    'powershell -ExecutionPolicy Bypass -command "Optimize-Volume -DriveLetter C -Defrag; Optimize-Volume -DriveLetter C -Retrim"',
    'powershell -ExecutionPolicy Bypass -command "\'rescan\' | diskpart"'],
    []);

function openSystemUpdate(){
    if (progressCount < installCount) {
        if (fs.existsSync('C:\\Program Files (x86)\\Lenovo\\System Update\\tvsu.exe')) {
            exec('"C:\\Program Files (x86)\\Lenovo\\System Update\\tvsu.exe"');
        } else if (fs.existsSync('C:\\Program Files (x86)\\Dell\\CommandUpdate\\DellCommandUpdate.exe')){
            exec('"C:\\Program Files (x86)\\Dell\\CommandUpdate\\DellCommandUpdate.exe"');
        }
        writeInstallFile(++progressCount);
        sleep(2000);
    }
}

/*  --== Extras Installers ==--  */

var installCaselle = new Installer('installCaselle',
    'Installing Caselle',
    ['"\\\\server\\data\\Installs\\Caselle Clarity\\ClarityReleaseCD4.2.128.x\\Caselle Runtime 30.exe" /qb /norestart',
    'msiexec /i "\\\\server.gov\\DATA\\Installs\\Caselle Clarity\\ClarityReleaseCD4.2.128.x\\SQLServer2005_BC_x64.msi" /qb /norestart',
    'msiexec /i "\\\\server.gov\\DATA\\Installs\\Caselle Clarity\\ClarityReleaseCD4.2.128.x\\CaselleClarity4_8.0.msi" /qb /norestart',
    'powershell -ExecutionPolicy Bypass -file "\\\\server\\data\\installs\\00newComputerSetup\\files\\scripts\\caselleInstall.ps1"'],
    ['C:\\Program Files (x86)\\Caselle Clarity 4\\Caselle.exe'],
    'caselle');

var installXprotect = new Installer('installXprotect',
    'Installing Milestone Xprotect',
    ['msiexec /i "\\\\server.gov\\DATA\\Installs\\MilestoneXProtectSmartClient_x64\\XProtect Smart Client 2017 R2 Installer x64.msi" /qb /norestart'],
    ['C:\\Program Files\\Milestone\\XProtect Smart Client\\Client.exe'],
    'xprotect');

var installDropbox = new Installer('installDropbox',
    'Installing Dropbox',
    ['"\\\\server.gov\\DATA\\Installs\\Dropbox\\DropboxInstaller.exe"'],
    ['C:\\Program Files (x86)\\Dropbox\\Client\\Dropbox.exe'],
    'dropbox');

var installEfilecabinet = new Installer('installEfileCabinet',
    'Installing eFileCabinet',
    ['msiexec /i "\\\\server.gov\\DATA\\Installs\\eFileCabinet\\Extracted\\eFileCabinetClientInstall.msi" /qb /norestart'],
    ['C:\\Program Files (x86)\\eFileCabinet 5\\Client\\efcClient.exe'],
    'eFileCabinet');

var installGoogleEarth = new Installer('installGoogleEarth',
    'Installing Google Earth Pro',
    ['msiexec /i "\\\\server.gov\\DATA\\Installs\\google earth\\GoogleEarthProSetup.msi" /qb /norestart'],
    ['C:\\Program Files (x86)\\Google\\Google Earth Pro\\client\\googleearth.exe'],
    'googleEarth');

var installers = [removeSetupUser, setAdminPass, removeCrap, turnOffSleep, turnOffSystemProtection, changeBadMicrosoft, installNet35, installSystemInfo, installMeraki, installOffice, installSystemUpdate, installVipreClient, installGlobalProtect, installAcrobatDC,
    installMXIE, installCaselle, installXprotect, installDropbox, installEfilecabinet, installGoogleEarth, installWinDirStat, installVievu, installEasyStreet, installSpillman, installVLC, installArbitrator, installGPSDrivers, runWindowsUpdate, cleanUpDisk, runCleanmgr, optimizeDrive, openSystemUpdate];
// var installers = [removeSetupUser, turnOffSleep, runCleanmgr];

stepCount = installers.length;
