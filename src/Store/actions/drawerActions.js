import { UPDATE_DRAWER_MENU } from "./actionTypes";

export const updateDrawerMenu = menuIndex => {
  return dispatch => {
    dispatch({
      type: UPDATE_DRAWER_MENU,
      selectedMenu: menuIndex
    });
  };
};