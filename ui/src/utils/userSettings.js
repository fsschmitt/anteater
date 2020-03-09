const ipc = window.require("electron").ipcRenderer;

export const getAll = () =>  {
  return new Promise((res, rej) => {
    ipc.once("getUserSettings:response", (_, { data, status, error }) => {
      if (status === 'success') {
        return res(data)
      }

      return rej(error);
    });
    ipc.send("getUserSettings:request")
  })
}

export const save = (settings) => {
  return new Promise((res, rej) => {
    ipc.once("setUserSettings:response", (_, { data, status, error }) => {
      if (status === 'success') {
        return res(data)
      }

      return rej(error)
    });
    ipc.send("setUserSettings:request", settings);
  })
}
