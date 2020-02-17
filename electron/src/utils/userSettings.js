const ipc = window.require("electron").ipcRenderer;

export const getAll = () =>  {
  return new Promise(res => {
    ipc.once("getUserSettings:response", (_, data) => res(data));
    ipc.send("getUserSettings:request")
  })
}

export const save = (settings) => {
  return new Promise(res => {
    ipc.once("setUserSettings:response", (_, data) => res(data));
    ipc.send("setUserSettings:request", settings);
  })
}
