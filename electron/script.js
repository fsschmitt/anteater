
var ipc = require('electron').ipcRenderer;
document.querySelector('form').addEventListener('submit', function(event){
  event.preventDefault();
  const getValueFromName = (name) => document.querySelector(`[name="${name}"]`).value;
  const days = [
    {
      "day": "Monday",
      "text": ""
    },
    {
      "day": "Tuesday",
      "text": ""
    },
    {
      "day": "Wednesday",
      "text": ""
    },
    {
      "day": "Thursday",
      "text": ""
    },
    {
      "day": "Friday",
      "text": ""
    }
  ];


  const daysWithValues = days.map(weekday => {
    return {
      ...weekday,
      text: getValueFromName(weekday.day)
    };
  })

  ipc.on('fillBlueantStatus', function(event, response){
    document.querySelector('#status').innerHTML = `Blueant status: ${response}`
  })

  ipc.send('fillBlueant', daysWithValues);
  document.querySelector('#status').innerHTML = 'Filling your blueant...'
});
