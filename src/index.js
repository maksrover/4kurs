import React from "react";
import { createRoot } from "react-dom";
import "./index.css";
import { router } from "./router"; // Importing 'router' directly from its file
import { Provider } from "react-redux";
import store from "./store/store";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {router} {/* Rendering 'router' directly */}
    </Provider>
  </React.StrictMode>
);
