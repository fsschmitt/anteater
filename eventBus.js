const electron = require("electron");
const fs = require("fs");
const path = require("path");
const appSettings = require('./appSettings');
const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const settingsPath = path.join(userDataPath, "settings.json");
const ipc = electron.ipcMain;

ipc.on("fillBlueant:request", function(event, { data }) {
  const runBlueAnt = require("./puppeteer/blueant");
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
  const isHeadless = !appSettings.get('showBrowser');
  runBlueAnt(data, { headless: isHeadless, settings })
    .then(() => {
      event.sender.send("fillBlueant:response", "success");
    })
    .catch(err => {
      event.sender.send("fillBlueant:response", "error");
    });
});

ipc.on("setUserSettings:request", function(event, data) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4), {
      flag: "w"
    });
    event.sender.send("setUserSettings:response", "success");
  } catch (e) {
    event.sender.send("setUserSettings:response", "error");
  }
});

ipc.on("getUserSettings:request", event => {
  try {
    const file = fs.readFileSync(settingsPath, "utf-8");
    const settings = JSON.parse(file);

    event.sender.send("getUserSettings:response", settings);
  } catch (e) {}
});
