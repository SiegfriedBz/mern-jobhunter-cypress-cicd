import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/scss/index.scss";

import App from "./App";
import {
  AppContextProvider,
  UserContextProvider,
  JobsContextProvider,
} from "./contextAPI/context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AppContextProvider>
    <UserContextProvider>
      <JobsContextProvider>
        <App />
      </JobsContextProvider>
    </UserContextProvider>
  </AppContextProvider>
  // </React.StrictMode>
);
