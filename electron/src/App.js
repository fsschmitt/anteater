import React from "react";
import { MemoryRouter as Router, Switch, Route, NavLink, Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import FillHoursScreen from "./FillHours";
import SettingsScreen from "./SettingsScreen";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <div className="py-2 w-screen fixed bg-blue-900 border-blue-800 z-10 border-b-1 border-t-0 border-r-0 border-l-0">
        <ul className="flex w-full mx-auto max-w px-3">
          <li className="px-0 pr-3 border-r">
            <NavLink exact activeClassName="text-blue-300" className="text-white hover:text-blue-800" to="/">
              Fill hours
            </NavLink>
          </li>
          <li className="px-3">
            <NavLink exact activeClassName="text-blue-300" className="text-white hover:text-blue-800" to="/settings">
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="bg-gray-100 h-full pt-6 px-3 ">
        <ToastContainer hideProgressBar />
        <Switch>
          <Route exact path="/" component={FillHoursScreen}/>
          <Route exact path="/settings" component={SettingsScreen} />
          <Redirect from="/:wtv" to="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
