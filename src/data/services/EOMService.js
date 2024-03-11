// Employees of the Month

import { stringify } from "qs";
import moment from "moment";

import { getAuthHeaders, URL_ADD_EOM, URL_ADD_EOM_NOMINATION, URL_ALL_EOM, URL_DELETE_EOM, URL_EOM_BY_ID, URL_EOM_BY_YEAR, URL_GET_ALL_EOM_NOMINATION, URL_UPDATE_EOM } from "../../common/APIUtils";
import axiosStack from "../network/axiosStack";

const getAllEOM = () => {
  return axiosStack({
    url: URL_ALL_EOM,
    method: "GET",
    headers: getAuthHeaders()
  });
};

const getEOMByID = eomId => {
  let mUrl = URL_EOM_BY_ID + eomId;
  return axiosStack({
    url: mUrl,
    method: "GET",
    headers: getAuthHeaders()
  });
};

const getCurrentEOM = () => {
  return getEOMByYear(
    moment()
      .subtract(1, "month")
      .format("YYYY_MM")
  );
};

const getEOMByYear = year => {
  let mUrl = URL_EOM_BY_YEAR + year;
  return axiosStack({
    url: mUrl,
    method: "GET",
    headers: getAuthHeaders()
  });
};

const addEOM = eom => {
  return axiosStack({
    url: URL_ADD_EOM,
    method: "POST",
    data: stringify(eom),
    headers: getAuthHeaders()
  });
};

const updateEOM = eom => {
  return axiosStack({
    url: URL_UPDATE_EOM,
    method: "POST",
    data: stringify(eom),
    headers: getAuthHeaders()
  });
};

const deleteEOM = eomId => {
  const eom = {
    eom_id: eomId
  };
  return axiosStack({
    url: URL_DELETE_EOM,
    method: "POST",
    data: stringify(eom),
    headers: getAuthHeaders()
  });
};

/**
 * Method to add nomination
 * @param {String} employee_id Nominee ID
 * @param {String} comments Comments for the selected employee
 */
const addNomination = (employee_id, comments) => {
  const nomination = {
    nominee: employee_id,
    comments: comments
  };
  // console.debug("nomination", nomination)
  return axiosStack({
    url: URL_ADD_EOM_NOMINATION,
    method: "POST",
    data: stringify(nomination),
    headers: getAuthHeaders()
  });
};

const getAllNominations = (mSlectedMonthYear) => {
  return axiosStack({
    url: URL_GET_ALL_EOM_NOMINATION,
    method: "GET",
    headers: getAuthHeaders(),
    params: {
      month: mSlectedMonthYear
    }
  });
};

export const EOMService = {
  addEOM,
  updateEOM,
  deleteEOM,
  getCurrentEOM,
  getAllEOM,
  getEOMByID,
  getEOMByYear,
  getAllNominations,
  addNomination
};
