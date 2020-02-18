const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const appSettings = require('./appSettings');
let win;
require('./eventBus');

let isDev = !app.isPackaged

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    width: 560,
    height: 690,
    center: true,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
      devTools: isDev,
    },
    icon: path.join(__dirname, 'assets/icons/icon.png')
  })

  isDev && win.webContents.openDevTools();

  const menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
        submenu: [
          {
            label: 'Show browser',
            click() {
              appSettings.toggle('showBrowser');
            },
            type: 'checkbox',
            checked: appSettings.get('showBrowser'),
            accelerator: 'CmdOrCtrl+Shift+B'
          },
          {type:'separator'},
          {
            label: 'Exit',
            click() {
              app.quit();
            }
          },
        ]
    }
  ])
  Menu.setApplicationMenu(menu);

  win.once('ready-to-show', () => {
    win.show()
  })

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? 'http://localhost:1234/'
      : `file://${path.join(__dirname, "./dist/index.html")}`
  )

  win.webContents.on("new-window", function(event, url) {
    event.preventDefault();
  });

  win.on("closed", () => (win = null));
}

app.whenReady().then(createWindow)
