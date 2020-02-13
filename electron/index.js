const ipc = require('electron').ipcMain;
const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 350,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
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
