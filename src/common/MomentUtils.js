import Moment from "moment";

export const DAY_MONTH_DATE = "dddd, MMM D";
export const DDDD_ONLY = "dddd";
export const MMM_ONLY = "MMM";
export const YYYY_ONLY = "YYYY";
export const D_ONLY = "D";
export const MMMdFormat = "MMM D";
export const MMMM_D = "MMMM D";
export const YYYY_MM_DD = "YYYY-MM-DD";
export const MMMM_D_YYYY = "MMMM D, YYYY";
export const DD_MM_YYYY = "DD/MM/YYYY";

export const formatDate = (date, format) => {
  return Moment.utc(date).local().format(format);
};

export const formatDateTime = (date, format) => {
  const utcTime = Moment.utc(date).toDate();
  return Moment(utcTime).format("MMM D, YYYY hh:mm A");
};

export const formatTimeOffReqDate = (d1, hours, leave_day) => {
  var date = Moment.utc(d1).local().format("D MMM");

  var timeOffValue;

  if (parseFloat(hours) >= 9.0) {
    var day = parseInt(leave_day) > 1 ? " Days" : " Day";
    timeOffValue = leave_day + day;
  } else {
    timeOffValue = hours + " Hrs";
  }

  return date + " - " + timeOffValue;
};

export const getFormattedLeaveDate = (d1, d2) => {
  var startMonth = Moment.utc(d1).local().format(MMM_ONLY);
  var endMonth = Moment.utc(d2).local().format(MMM_ONLY);
  if (startMonth === endMonth) {
    var startDay = Moment.utc(d1).local().format(D_ONLY);
    var endDay = Moment.utc(d2).local().format(D_ONLY);

    if (startDay === endDay) {
      return formatDate(d1, DAY_MONTH_DATE);
    } else {
      return formatDate(d1, DAY_MONTH_DATE) + " - " + formatDate(d2, D_ONLY);
    }
  } else {
    return formatDate(d1, DAY_MONTH_DATE) + " - " + formatDate(d2, MMMdFormat);
  }
};

export const getCurrentDate = (format = YYYY_MM_DD) => {
  return Moment.utc().local().format(format);
};

export const getDay = (date) => {
  return Moment.utc(date).local().format(DDDD_ONLY);
};

export const getMonthAndDate = (date) => {
  return Moment.utc(date).local().format(MMMM_D);
};

export const getYear = (date) => {
  return Moment.utc(date).local().format(YYYY_ONLY);
};
