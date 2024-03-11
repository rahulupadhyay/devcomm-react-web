import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import combineReducers from "redux/src/combineReducers";
import userReducer from "./user";
import dialogReducer from "./dialog";
import eomReducer from "./eom";
import snackbarReducer from "./snackbar";
import drawerReducer from "./drawer";

/* 
We are persisting auth & fcm token in redux store permanently from auth store
*/
const userPersistConfig = {
  key: "usr",
  storage: storage,
  blacklist: ["isFetching"],
};

const rootReducer = combineReducers({
  usr: persistReducer(userPersistConfig, userReducer),
  dlg: dialogReducer,
  eom: eomReducer,
  snb: snackbarReducer,
  drw: drawerReducer,
});

export default rootReducer;
