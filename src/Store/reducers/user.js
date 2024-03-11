import {
  INIT_REQUEST,
  STORE_USER,
  UNAUTHORIZED,
  UPDATE_EMPLOYEES,
  UPDATE_PROFILE,
  UPDATE_PROFILE_IMAGE,
  CLEAR_DATA,
} from "../actions/actionTypes";

const initialState = {
  isFetching: false,
  employee: {},
  employeeImage: "",
  loggedIn: false,
  employees: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case STORE_USER:
      return {
        ...state,
        isFetching: false,
        employee: action.payload,
        employeeImage: action.image,
        loggedIn: action.loggedIn,
      };

    case UPDATE_EMPLOYEES:
      // console.log(action);
      return {
        ...state,
        isFetching: false,
        employees: action.payload,
      };
    case UPDATE_PROFILE:
      // console.log(action);
      return {
        ...state,
        isFetching: false,
        employee: action.payload,
      };
    case UPDATE_PROFILE_IMAGE:
      // console.log(action);
      return {
        ...state,
        isFetching: false,
        employeeImage: action.payload,
      };
    case UNAUTHORIZED:
      // console.log(action);
      return {
        ...state,
        loggedIn: false,
      };

    case CLEAR_DATA:
      return initialState;

    default:
      return state;
  }
};

export default userReducer;

// EMPLOYEE LITERALS
// message,
// Image,
// address,
// birth_date,
// department,
// email,
// empOtherInterest,
// employee_id,
// first_name,
// gmailId,
// hire_date,
// id,
// last_name,
// officeName,
// phone,
// role_id,
// skypeId,
// user_role,
// whatsapp_number
