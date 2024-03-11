import { AuthService } from "../../data/services";
import {
  HIDE_PROGRESS_DIALOG,
  SHOW_PROGRESS_DIALOG,
  STORE_USER,
  UNAUTHORIZED,
} from "./actionTypes";
import {
  setAuthToken,
  setLoggedIn,
  setUserData,
  setUserId,
  setUserImage,
} from "../../data/storage";

export const authenticate = (email, password) => {
  return (dispatch) => {
    dispatch({
      type: SHOW_PROGRESS_DIALOG,
    });
    dispatch(auth(email, password));
  };
};

export const auth = (email, password) => {
  return (dispatch) => {
    AuthService.login(email, password)
      .then((response) => {
        dispatch({
          type: HIDE_PROGRESS_DIALOG,
        });
        dispatch(storeUser(response));
      })
      .catch((response) => {
        dispatch({
          type: STORE_USER,
          payload: response,
          loggedIn: false,
        });
      });
  };
};

export const unautorize = () => {
  return (dispatch) => {
    setLoggedIn(false);
    dispatch({
      type: UNAUTHORIZED,
    });
  };
};

export const storeUser = (res) => {
  // console.log(res);
  if (res.status === 1) {
    // console.log(res.values);

    // Store data locally
    let userInfo = res.values;

    setLoggedIn("true");
    setUserData(JSON.stringify(userInfo));

    setUserId(userInfo.id);
    //setUserImage(userInfo.Image);
    setAuthToken(res.values.auth_token);

    return {
      type: STORE_USER,
      payload: userInfo,
      image: userInfo.Image,
      loggedIn: true,
      // or we can pass specific fields to store in the state
      /*payload: {
                empId: res.values.id,
                firstName: res.values.first_name,
                lastName: res.values.last_name,
                image: res.values.Image
            }*/
    };
  } else {
    setLoggedIn("false");
    // alert(res.message);
    return {
      type: STORE_USER,
      payload: res,
      loggedIn: false,
    };
  }
};
