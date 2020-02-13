const ipc = require('electron').ipcMain;
const fs = require('fs');

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
    fs.writeFileSync('./settings.json', JSON.stringify(data, null, 4), 'utf-8');
    event.sender.send('saveSettings:status', 'success');
  } catch(e) {
    event.sender.send('saveSettings:status', 'error');
  }
});
