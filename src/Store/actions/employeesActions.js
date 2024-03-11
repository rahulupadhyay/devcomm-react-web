import { ContactService } from "../../data/services";
import {
  INIT_REQUEST,
  UPDATE_EMPLOYEES,
  CLEAR_DATA,
  STORE_ALL_CONTACTS,
} from "./actionTypes";

export const getAllEmployees = (props) => {
  const storeUsers = (res) => {
    if (res.status === 1) {
      return { type: UPDATE_EMPLOYEES, payload: res.values };
    } else {
      return { type: UPDATE_EMPLOYEES, payload: [] };
    }
  };

  return (dispatch) => {
    dispatch({ type: INIT_REQUEST });
    ContactService.getContacts()
      .then((response) => dispatch(storeUsers(response)))
      .catch((response) => dispatch({ type: UPDATE_EMPLOYEES, payload: [] }));
  };
};

export const storeContacts = (allMembers) => {
  return (dispatch) => {
    dispatch({ type: STORE_ALL_CONTACTS, payload: allMembers });
  };
};

export const clearAppData = () => {
  return (dispatch) => dispatch({ type: CLEAR_DATA });
};
