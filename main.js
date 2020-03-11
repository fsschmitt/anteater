const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const appSettings = require("./electron/appSettings");
let win;
let isDev = !app.isPackaged;

require("./electron/eventBus");
!isDev && require("./shared/sentry");

const getBrowserWindowInstance = () => {
  return new BrowserWindow({
      show: false,
      width: 560,
      height: 690,
      center: true,
      resizable: isDev,
      webPreferences: {
        nodeIntegration: true,
        scrollBounce: true,
        devTools: isDev,
        preload: path.join(__dirname, 'shared', 'sentry.js'),
        nativeWindowOpen: true
      },
      icon: path.join(__dirname, 'assets/icons/icon.png')
    })
}

function createWindow() {
  // Create the browser window.
  win = getBrowserWindowInstance();
  isDev && win.webContents.openDevTools();

  const menu = Menu.buildFromTemplate([
    { role: "fileMenu" },
    { role: "editMenu" },
    {
      label: "Debug",
      submenu: [
        {
          label: "Show browser",
          click() {
            appSettings.toggle("showBrowser");
          },
          type: "checkbox",
          checked: appSettings.get("showBrowser"),
          accelerator: "CmdOrCtrl+Shift+B"
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  win.once("ready-to-show", () => {
    win.show();
  });

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:1234/"
      : `file://${path.join(__dirname, "./dist/index.html")}`
  );

  win.webContents.on("new-window", function(event, url, frameName, disposition, options) {
    event.preventDefault();
    if (frameName === "modal") {
      // open window as modal
      event.preventDefault();
      Object.assign(options, {
        modal: true,
        parent: win,
        width: 500,
        height: 500
      });
      event.newGuest = new BrowserWindow(options);
    }
  });

  win.on("closed", () => (win = null));
}

app.whenReady().then(createWindow);

ipcMain.on("anteater.error", () => {
  console.log("Error triggered in main processes");
  throw new Error("Error triggered in main processes");
});

ipcMain.on("anteater.crash", () => {
  console.log("process.crash()");
  process.crash();
});
