import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.scss";
import { persistor, store } from "./redux/store";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  // <Provider store={store}>
    // <PersistGate loading={null} persistor={persistor}>
      <App />
    // </PersistGate>
  // </Provider>
);
