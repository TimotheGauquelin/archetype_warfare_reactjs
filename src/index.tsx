import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.scss";
import { persistor, store } from "./redux/store";
import App from "./App";
import { configureInterceptors, setupApiInterceptors } from "./api/interceptors";

// Configuration des intercepteurs Axios
configureInterceptors(store);
setupApiInterceptors();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
