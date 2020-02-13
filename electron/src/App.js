import React from "react";
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from "react-router-dom";
import FillHoursScreen from "./FillHours";
import SettingsScreen from "./SettingsScreen";

const App = () => {
  return (
    <Router>
      <div className="py-2 w-screen fixed bg-gray-500 border-gray-600 z-10 border-b-1 border-t-0 border-r-0 border-l-0">
        <ul className="flex w-full mx-auto max-w-md">
          <li className="px-3 border-r">
            <NavLink activeClassName="text-purple-800" className="text-white hover:text-purple-800" to="/home">
              Fill hours
            </NavLink>
          </li>
          <li className="px-3">
            <NavLink activeClassName="text-purple-800" className="text-white hover:text-purple-800" to="/settings">
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="bg-gray-100 w-screen h-full pt-6">
        <Switch>
          <Route exact path="/home" default>
            <FillHoursScreen />
          </Route>
          <Route strict exact path="/settings">
            <SettingsScreen/>
          </Route>
          <Redirect exact from="/" to="/home" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
