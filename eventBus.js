const electron = require('electron')
const fs = require('fs');
const path = require('path');

const ipc = electron.ipcMain;

const userDataPath = (electron.app || electron.remote.app).getPath('userData');

ipc.on('fillBlueant', function(event, { data, showBrowser }){
  const runBlueAnt = require('./puppeteer/blueant');
  runBlueAnt(data, { headless: !showBrowser })
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
    fs.writeFileSync(path.join(userDataPath, 'settings.json'), JSON.stringify(data, null, 4), { flag: 'w' });
    event.sender.send('saveSettings:status', 'success');
    console.log('SUCCESS')
  } catch(e) {
    console.log('ERRR', e);
    event.sender.send('saveSettings:status', 'error');
  }
});
