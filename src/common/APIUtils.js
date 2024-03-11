import { getAuthToken } from "../data/storage";
import { logger } from "./logger";

// Local. Dhaval's Machine
const LOCAL_ENV = {
  BASE_URL: "http://10.30.16.7/index.php",
};

// Staging
const STAGING_ENV = {
  BASE_URL: "https://devtracker.devdigdev.com/index.php",
};

// Live
const PRODUCTION_ENV = {
  BASE_URL: "https://devtracker.devdigital.com/index.php",
};

// TODO Change this to PRODUCTION_ENV when publish to LIVE
const PRODUCTION_VARIANT = PRODUCTION_ENV;
logger.debug("PRODUCTION>>" + PRODUCTION_VARIANT.BASE_URL);

const DEVELOPMENT_VARIANT = STAGING_ENV;
logger.debug("DEVELOPMENT>>" + DEVELOPMENT_VARIANT.BASE_URL);

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? PRODUCTION_VARIANT.BASE_URL
    : PRODUCTION_VARIANT.BASE_URL;

// Colloborators
export const URL_ALBUM_COLLOBORATOR =
  "?route=apiv2/collaborator/hasAccess&type=album";
export const URL_EOM_COLLOBORATOR =
  "?route=apiv2/collaborator/hasAccess&type=eom";

// Album Module
export const URL_GET_ALBUMS = "?route=apiv2/album/get";
export const URL_ADD_ALBUM = "?route=apiv2/album/add"; // POST service
export const URL_UPDATE_ALBUM = "?route=apiv2/album/update"; // POST service
export const URL_GET_ALBUM = "?route=apiv2/album/get&album_id="; // GET
export const URL_GET_YEAR_ALBUM = "?route=apiv2/album/get&year="; // GET
export const URL_DELETE_ALBUM = "?route=apiv2/album/delete"; // POST (param: album_id)

// Meeting Module
export const URL_GET_MEETINGS = "?route=apiv2/meeting/get";
export const URL_GET_MEETING_DETAILS = "?route=apiv2/meeting/get&meeting_id=";
export const URL_DELETE_MEETING = "?route=apiv2/meeting/delete"; // param meeting_id
export const URL_ADD_MEETING = "?route=apiv2/meeting/add";
export const URL_UPDATE_MEETING = "?route=apiv2/meeting/update";
export const URL_UPDATE_MEETING_STATUS =
  "?route=apiv2/meeting/updateConfirmation"; // params {meeting_id, statys (YES/MAYBE/NO)}

// EOM Module
export const URL_ALL_EOM = "?route=apiv2/eom/get"; // GET All EOM
export const URL_EOM_BY_ID = "?route=apiv2/eom/get&eom_id=";
export const URL_EOM_BY_YEAR = "?route=apiv2/eom/get&year=";
export const URL_DELETE_EOM = "?route=apiv2/eom/delete"; // param eom_id
export const URL_UPDATE_EOM = "?route=apiv2/eom/update";
export const URL_ADD_EOM = "?route=apiv2/eom/batchAdd";

// EOM Nomination Module
export const URL_ADD_EOM_NOMINATION = "?route=apiv2/eom_nomination/add";
export const URL_GET_ALL_EOM_NOMINATION = "?route=apiv2/eom_nomination/get";

// AUTH Module
export const URL_LOGIN = "?route=apiv2/auth/login"; // POST service
export const URL_LOGOUT = "?route=apiv2/auth/logout"; // POST service

//Device Info Module
export const URL_UPDATE_DEVICE_INFO =
  "?route=apiv2/device_info/updateDeviceInfo"; // POST service
export const URL_GET_DEVICES = "?route=apiv2/device_info/get"; // GET service
export const URL_DELETE_DEVICE = "?route=apiv2/device_info/deleteDeviceInfo"; // POST service

// Contact Module
export const URL_CONTACTS = "?route=apiv2/contact/get"; // GET service
export const URL_CONTACT_BY_ID = "?route=apiv2/contact/get&user_id="; // GET contact by ID
export const URL_SKILLS = "?route=apiv2/profile/expertise"; // GET Service with param user_id
export const URL_SKILLS_BY_ID = "?route=apiv2/profile/expertise&user_id="; // GET Service with param user_id
export const URL_DASHBOARD = "?route=apiv2/contact/dashboard"; // GET Service with param current date, {date=2019-07-01}

// Profile Module
export const URL_UPDATE_PROFILE_PIC = "?route=apiv2/profile/changeAvatar"; // POST service
export const URL_UPDATE_PROFILE = "?route=apiv2/profile/update"; // POST service
export const URL_UPDATE_PASSWORD = "?route=apiv2/profile/changePassword"; // POST service

// Calendar Module
export const URL_GET_CALENDAR = "?route=apiv2/calendar/getCalendarEvents";

// Holidays Module
export const URL_HOLIDAYS = "?route=apiv2/calendar/getHoliday&year="; // GET | 2019;

// Time Tracker Module
export const URL_GET_TIME_CARD = "?route=api/dev/getTimeCardData"; // POST
export const URL_GET_TIME_OFF =
  "?route=apiv2/timeoff_tracker/getTimeOffs&year="; // GET
export const URL_GET_TIME_OFF_DETAILS =
  "?route=apiv2/timeoff_tracker/getTimeOffById&id="; // GET
export const URL_CANCEL_TIME_OFF = "?route=apiv2/timeoff/cancelTimeOff"; // POST
export const URL_GET_MANAGERS = "?route=apiv2/timeoff_tracker/getManagers"; // GET
export const URL_GET_TIME_OFF_HOURS =
  "?route=apiv2/timeoff_tracker/getTimeOffHours"; // GET Service with param start_date & end_date, {date=2019-07-01}
export const URL_SUBMIT_TIME_OFF = "?route=apiv2/timeoff/addTimeOff"; // POST
export const URL_GET_TIME_OFF_REQ =
  "?route=apiv2/timeoff_tracker/getTimeOffRequests&year="; // GET
export const URL_APPROVE_DECLINE_TIME_OFF =
  "?route=apiv2/timeoff/approveDenyTimeOffRequest"; // POST

/**
 * Headers config
 * @param {String} contentType default value 'application/x-www-form-urlencoded'
 */
export const getHeaders = (
  contentType = "application/x-www-form-urlencoded"
) => {
  return {
    Authorization: "Basic ZGV2dHJhY2tlcjpkZXZ0cmFja2VyQDA4MTY=",
    "content-type": contentType,
    "Access-Control-Allow-Origin": true,
  };
};

/**
 * Auth Headers config
 * @param {String} contentType
 */
export const getAuthHeaders = (contentType) => {
  let existingHeaders = getHeaders();
  if (contentType != null) {
    existingHeaders["content-type"] = contentType;
  }
  existingHeaders["Auth-Token"] = getAuthToken();

  return existingHeaders;
};
