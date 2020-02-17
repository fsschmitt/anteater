import React, { useState, useEffect } from "react";
import cn from "classnames";
import { toast } from 'react-toastify';
import * as userSettings from './utils/userSettings';
const ipc = window.require("electron").ipcRenderer;

const defaultSettings = {
  customerName: "KI Group",
  projectName: "KI labs Portugal - internal 2020 (KI labs Portugal - int 2020)",
  activityName: "1 Internal projects",
  locationName: "Office Lisbon",
  username: "j.doe@kigroup.de",
  password: "ThisIsMyPasswordForBlueAnt"
};

const SETTINGS_FIELDS = Object.keys(defaultSettings);

const SettingsScreen = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isDirty, setIsDirty] = useState(false);

  const setSettingsByName = (name, key) => {
    setIsDirty(true);
    setSettings({
      ...settings,
      [name]: key
    });
  };

  const onSubmit = event => {
    event.preventDefault();
    userSettings.save(settings)
    setIsDirty(false);
  };

  useEffect(() => {
    userSettings.getAll().then((savedUserSettings) => {
      setSettings(savedUserSettings)
    })
  }, []);

  useEffect(() => {
    const listener = function(_, { status }) {
      if (status === 'success') {
        toast.success('Settings saved with success!');
        return;
      }

      if (status === 'error') {
        toast.error('Error saving your settings');
        return;
      }
    };

    ipc.on("setUserSettings:response", listener);

    return () => {
      ipc.off("setUserSettings:response", listener);
    };
  }, [ipc]);

  return (
    <div className="container w-screen justify-center items-center p-2 relative">
      <form onSubmit={onSubmit} className="w-full mx-auto max-w-md">
        <h3 className="text-xl border-b mb-2 text-blue-800 leading-loose text-blue font-bold">
          Settings
        </h3>
        {SETTINGS_FIELDS.map(fieldName => (
          <div className="md:flex md:items-center mb-2" key={fieldName}>
            <div className="md:w-1/3">
              <label className="block capitalize text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                {fieldName}
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-100 appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-600"
                type={fieldName === "password" ? "password" : "text"}
                name={fieldName}
                onChange={e => {
                  e.preventDefault();
                  setSettingsByName(fieldName, e.target.value);
                }}
                value={settings[fieldName]}
              />
            </div>
          </div>
        ))}
        <input
          disabled={!isDirty}
          className={cn(
            {
              "opacity-25 cursor-not-allowed": !isDirty,
              isDirty: "hover:bg-blue-400"
            },
            "bg-blue-800 flex-grow-0 text-white font-bold py-2 px-4 rounded"
          )}
          type="submit"
          value="Save!"
        />
      </form>
    </div>
  );
};

export default SettingsScreen;
