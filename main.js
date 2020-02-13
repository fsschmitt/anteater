const { app, BrowserWindow } = require('electron')
const path = require('path')
let win;
require('./eventBus');

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 560,
    height: 690,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'assets/icons/icon.png')
  })

  // and load the index.html of the app.
  // win.loadURL(
  //   !app.isPackaged
  //     ? 'http://localhost:1234'
  //     : `file://${path.join(__dirname, "./dist/index.html")}`
  // )
  win.loadFile('./dist/index.html')

  // Open the DevTools.
  app.isPackaged && win.webContents.openDevTools()

  win.on("closed", () => (win = null));
}

app.whenReady().then(createWindow)
