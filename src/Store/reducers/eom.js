import {
  STORE_ALL_CONTACTS,
  STORE_NOMINEE,
  CLEAR_NOMINEE,
  REMOVE_NOMINEE,
} from "../actions/actionTypes";

const initialState = {
  contacts: [],
  nominees: [],
};

const eomReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_ALL_CONTACTS:
      return { ...state, contacts: action.payload };
    case STORE_NOMINEE:
    case CLEAR_NOMINEE:
    case REMOVE_NOMINEE:
      return { ...state, nominees: action.payload };
    default:
      return state;
  }
};

export default eomReducer;
