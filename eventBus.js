const electron = require('electron')
const fs = require('fs');
const path = require('path');
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const settingsPath = path.join(userDataPath, 'settings.json');
const ipc = electron.ipcMain;

ipc.on('fillBlueant', function(event, { data, showBrowser }){
  const runBlueAnt = require('./puppeteer/blueant');
  const settings = fs.readFileSync(settingsPath, 'utf-8');
  runBlueAnt(data, { headless: !showBrowser, settings })
    .then(() => {
      event.sender.send('fillBlueant:status', 'success');
    })
    .catch((err) => {
      console.error(err)
      event.sender.send('fillBlueant:status', 'error');
    })
});

ipc.on('saveSettings', function(event, data) {
  console.log(data)
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4), { flag: 'w' });
    event.sender.send('saveSettings:status', 'success');
    console.log('SUCCESS')
  } catch(e) {
    console.log('ERRR', e);
    event.sender.send('saveSettings:status', 'error');
  }
});
