const electron = require("electron");
const fs = require("fs");
const path = require("path");
const appSettings = require('./appSettings');
const blueant = require("./puppeteer/blueant");
const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const settingsPath = path.join(userDataPath, "settings.json");
const ipc = electron.ipcMain;

ipc.on("fillBlueant:request", function(event, { data }) {
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  const isHeadless = !appSettings.get('showBrowser');
  blueant.run(data, { headless: isHeadless, settings })
    .then((screenshot) => {
      event.sender.send("fillBlueant:response", { status: "success", data: screenshot });
    })
    .catch(error => {
      event.sender.send("fillBlueant:response", {status: "error", error });
    });
});

ipc.on('cancelFillBlueant', () => {
  blueant.cancel();
})

ipc.on("setUserSettings:request", function(event, data) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4), {
      flag: "w"
    });
    event.sender.send("setUserSettings:response", {status: "success"});
  } catch (error) {
    event.sender.send("setUserSettings:response", {status: "error", error});
  }
});

ipc.on("getUserSettings:request", event => {
  try {
    const file = fs.readFileSync(settingsPath, "utf-8");
    const settings = JSON.parse(file);

    event.sender.send("getUserSettings:response", {status: 'success', data: settings});
  } catch (error) {
    event.sender.send("getUserSettings:response", {status: 'error', error });
  }
});
