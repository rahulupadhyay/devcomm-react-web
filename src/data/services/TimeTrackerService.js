import axiosStack from "../network/axiosStack";
import {
  URL_GET_TIME_CARD,
  getAuthHeaders,
  URL_GET_TIME_OFF,
  URL_GET_TIME_OFF_DETAILS,
  URL_CANCEL_TIME_OFF,
  URL_GET_MANAGERS,
  URL_GET_TIME_OFF_HOURS,
  URL_SUBMIT_TIME_OFF,
  URL_GET_TIME_OFF_REQ,
  URL_APPROVE_DECLINE_TIME_OFF,
} from "../../common/APIUtils";
import { getUserId } from "../../data/storage";
import { stringify } from "qs";
import moment from "moment";

const getTimeCard = (startDate, endDate) => {
  let params = {
    user_id: getUserId(),
    start_date: moment(startDate).format("YYYY-MM-DD"),
    end_date: moment(endDate).format("YYYY-MM-DD"),
  };
  return axiosStack({
    url: URL_GET_TIME_CARD,
    method: "POST",
    data: stringify(params),
    headers: getAuthHeaders(),
  });
};

const getTimeOffList = (year) => {
  return axiosStack({
    url: URL_GET_TIME_OFF + year,
    method: "GET",
    headers: getAuthHeaders(),
  });
};

const getTimeOffDetails = (id) => {
  return axiosStack({
    url: URL_GET_TIME_OFF_DETAILS + id,
    method: "GET",
    headers: getAuthHeaders(),
  });
};

const cancelLeaveRequest = (id) => {
  let params = { id: id };
  return axiosStack({
    url: URL_CANCEL_TIME_OFF,
    method: "POST",
    data: stringify(params),
    headers: getAuthHeaders(),
  });
};

const getManagers = () => {
  return axiosStack({
    url: URL_GET_MANAGERS,
    method: "GET",
    headers: getAuthHeaders(),
  });
};

const getTimeOffHours = (startDate, endDate) => {
  let mUrl =
    URL_GET_TIME_OFF_HOURS +
    "&start_date=" +
    startDate +
    "&end_date=" +
    endDate;
  return axiosStack({
    url: mUrl,
    method: "GET",
    headers: getAuthHeaders(),
  });
};

const submitTimeOff = (params) => {
  return axiosStack({
    url: URL_SUBMIT_TIME_OFF,
    method: "POST",
    data: params,
    headers: getAuthHeaders("multipart/form-data"),
  });
};

const getTimeOffReqList = (year) => {
  return axiosStack({
    url: URL_GET_TIME_OFF_REQ + year,
    method: "GET",
    headers: getAuthHeaders(),
  });
};

const approveOrDeclineTimeOff = (params) => {
  return axiosStack({
    url: URL_APPROVE_DECLINE_TIME_OFF,
    method: "POST",
    data: stringify(params),
    headers: getAuthHeaders(),
  });
};

export const TimeTrackerService = {
  getTimeCard,
  getTimeOffList,
  getTimeOffDetails,
  cancelLeaveRequest,
  getManagers,
  getTimeOffHours,
  submitTimeOff,
  getTimeOffReqList,
  approveOrDeclineTimeOff,
};
