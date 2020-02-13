const ipc = require('electron').ipcMain;
const path = require('path')
const { app, BrowserWindow } = require('electron')

if (!app.isPackaged) {
  require('electron-reload')(__dirname)
}

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 350,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'assets/icons/icon.png')
  })

  // and load the index.html of the app.
  win.loadFile('./electron/index.html')

  // Open the DevTools.
  // win.webContents.openDevTools()
}

ipc.on('fillBlueant', function(event, data){
  const runBlueAnt = require('../puppeteer/blueant');
  runBlueAnt(data)
    .then(() => {
      debugger;
      event.sender.send('fillBlueantStatus', 'success');
    })
    .catch(() => {
      debugger
      event.sender.send('fillBlueantStatus', 'error');
    })
});

app.whenReady().then(createWindow)
