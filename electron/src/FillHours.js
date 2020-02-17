import React, { useState, useEffect } from "react";
import cn from "classnames";
import Loading from "./Loading";
import { toast } from "react-toastify";
const ipc = window.require("electron").ipcRenderer;

let daysDefault = [
  {
    day: "Monday",
    text: ""
  },
  {
    day: "Tuesday",
    text: ""
  },
  {
    day: "Wednesday",
    text: ""
  },
  {
    day: "Thursday",
    text: ""
  },
  {
    day: "Friday",
    text: ""
  }
];

let persistedIsDirty = false;

const FillHoursScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState(daysDefault);
  const [isDirty, setIsDirty] = useState(persistedIsDirty);
  const [weekPreview, setWeekPreview] = useState(null);

  const setDaysByName = (name, value) => {
    setIsDirty(true);
    const updatedDays = days.map(weekday => {
      if (weekday.day === name) {
        return {
          ...weekday,
          text: value
        };
      }

      return weekday;
    });

    setDays(updatedDays);
  };

  useEffect(() => {
    daysDefault = days;
  }, [days]);

  useEffect(() => {
    persistedIsDirty = isDirty;
  }, [isDirty]);

  useEffect(() => {
    const listener = function(_, { status, error, data }) {
      setIsLoading(false);
      if (status === "success") {
        setWeekPreview(`data:image/png;base64, ${data}`);
        setIsDirty(false);
        toast.success("Your BlueAnt was filled with success!");
        return;
      }

      if (status === "error") {
        toast.error(error);
        return;
      }
    };

    ipc.on("fillBlueant:response", listener);

    return () => {
      ipc.off("fillBlueant:response", listener);
    };
  }, [ipc]);

  const cancelBlueant = () => {
    setIsLoading(false);
    ipc.send("cancelFillBlueant");
  };

  const onSubmit = event => {
    event.preventDefault();

    setIsLoading(true);
    ipc.send("fillBlueant:request", { data: days });
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed flex flex-col w-full h-full z-10 margin items-center justify-center">
          <Loading />
          <button
            className="bg-red-800 mt-2 flex-grow-0 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={cancelBlueant}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="container justify-center items-center relative pt-3">
        <form
          className={cn("mx-auto", { "opacity-50": isLoading })}
          onSubmit={onSubmit}
        >
          <h3 className="text-xl border-b mb-2 text-blue-800 leading-loose text-blue font-bold">
            What have you done this week?
          </h3>
          {weekPreview && <img src={weekPreview} />}
          {days.map(weekday => (
            <div className="md:flex md:items-center mb-2" key={weekday.day}>
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  {weekday.day}
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  className="bg-gray-100 appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-600"
                  type="text"
                  disabled={isLoading}
                  name={weekday.day}
                  onChange={e => setDaysByName(weekday.day, e.target.value)}
                  value={weekday.text}
                />
              </div>
            </div>
          ))}
          <div className="max-w w-full mx-auto flex flex-row justify-between">
            <input
              className={cn(
                { "cursor-not-allowed": isLoading || !isDirty },
                { "opacity-25": isLoading || !isDirty },
                { "hover:bg-blue-400": isDirty },
                "bg-blue-800 flex-grow-0 text-white font-bold py-2 p-4 rounded cursor-pointer"
              )}
              disabled={!isDirty}
              type="submit"
              value="Fill it!"
              onClick={onSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FillHoursScreen;
