import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import thunk from "redux-thunk";
import rootReducer from "./Store/reducers";
import { registerServiceWorker } from "./register-sw";

let middleware = undefined;
if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middleware = applyMiddleware(thunk, logger);
} else {
  middleware = applyMiddleware(thunk);
}
const enhancer = compose(middleware);

const store = createStore(rootReducer, enhancer);

const persistor = persistStore(store);

registerServiceWorker();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
