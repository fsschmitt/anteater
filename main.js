const { app, BrowserWindow } = require('electron')
const isDev = require("electron-is-dev");
require('./eventBus');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 560,
    height: 690,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? 'http://localhost:1234'
      : `file://${path.join(__dirname, "../dist/index.html")}`
  )

  // Open the DevTools.
  isDev && win.webContents.openDevTools()

  win.on("closed", () => (mainWindow = null));
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.whenReady().then(createWindow)
