window.require("../sentry");
import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import * as util from "./src/utils/userSettings";
import * as Sentry from "@sentry/electron";

const { ipcRenderer } = window.require("electron");
const { crash } = global.process || {};

window.errorMain = () => {
  ipcRenderer.send("anteater.error");
};

window.errorRenderer = () => {
  throw new Error("Error triggered in renderer process");
};

window.crashMain = () => {
  ipcRenderer.send("anteater.crash");
};

window.crashRenderer = crash;

window.versions = {
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  node: process.versions.node
};

util.getAll().then(settings => {
  Sentry.configureScope(scope => {
    scope.setUser({ email: settings.username });
  });
});

ReactDOM.render(<App />, document.getElementById("root"));
