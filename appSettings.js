const electron = require("electron");
const fs = require("fs");
const path = require("path");
const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const appSettingsPath = path.join(userDataPath, "appSettings.json");

const getAll = () => {
  try {
    const file = fs.readFileSync(appSettingsPath, "utf-8");
    return JSON.parse(file);
  } catch(e) {
    return {}
  }
};
const get = key => {
  return getAll()[key];
};
const set = (key, value) => {
  const currentSettings = getAll();
  fs.writeFileSync(
    appSettingsPath,
    JSON.stringify(
      {
        ...currentSettings,
        [key]: value
      },
      null,
      4
    ),
    {
      flag: "w"
    }
  );
};

const toggle = (key) => {
  set(key, !get(key));
}

exports.getAll = getAll;
exports.get = get;
exports.set = set;
exports.toggle = toggle;
