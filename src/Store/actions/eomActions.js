import { REMOVE_NOMINEE, STORE_NOMINEE, CLEAR_NOMINEE } from "./actionTypes";

export const storeNominee = nominees => {
  return dispatch => {
    dispatch({
      type: STORE_NOMINEE,
      payload: nominees
    });
  };
};

export const clearNominee = () => {
  return dispatch => {
    dispatch({
      type: CLEAR_NOMINEE,
      payload: []
    });
  };
};

export const removeNominee = (nominees, nominee) => {
  return dispatch => {
    nominees.map((nom, index) => {
      if (Object.keys(nom)[0] === nominee.nominee) {
        nominees.splice(index, 1);
        // console.debug("Updated Nominees", nominees);
        dispatch({
          type: REMOVE_NOMINEE,
          payload: nominees
        });
      }
      return true;
    });
  };
};
