import { colors } from "../../common/colors";

const strings = {
  upcoming: "Upcoming",
  past: "Past",
  leaveType: "Leave Type",
  fullDay: "Full Day",
  halfDay: "Half Day",
  leaveStatus: "Leave Status",
  approved: "Approved",
  cancelled: "Cancelled",
  declined: "Declined",
  pending: "Pending",
};

export const _getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return colors.blue_300;
    case "Denied":
      return colors.red_300;
    case "Approved":
      return colors.green_300;
    case "Cancelled":
      return colors.deep_orange_300;
    default:
      return colors.grey_300;
  }
};

export const LEAVE_TIME = "LEAVE_TIME";
export const LEAVE_TYPE = "LEAVE_TYPE";
export const LEAVE_STATUS = "LEAVE_STATUS";

export const generateFilters = () => {
  var filterList = [];
  filterList.push({
    id: 1,
    label: strings.upcoming,
    color: colors.pink_100,
    isSelected: false,
    type: LEAVE_TIME,
  });
  filterList.push({
    id: 2,
    label: strings.past,
    color: colors.light_blue_100,
    isSelected: false,
    type: LEAVE_TIME,
  });
  filterList.push({
    id: 3,
    label: strings.fullDay,
    color: colors.red_100,
    isSelected: false,
    type: LEAVE_TYPE,
  });
  filterList.push({
    id: 4,
    label: strings.halfDay,
    color: colors.deep_purple_100,
    isSelected: false,
    type: LEAVE_TYPE,
  });
  filterList.push({
    id: 5,
    label: strings.approved,
    color: colors.green_300,
    isSelected: false,
    type: LEAVE_STATUS,
  });
  filterList.push({
    id: 6,
    label: strings.cancelled,
    color: colors.deep_orange_300,
    isSelected: false,
    type: LEAVE_STATUS,
  });
  filterList.push({
    id: 7,
    label: strings.declined,
    color: colors.red_300,
    isSelected: false,
    type: LEAVE_STATUS,
  });
  filterList.push({
    id: 8,
    label: strings.pending,
    color: colors.blue_300,
    isSelected: false,
    type: LEAVE_STATUS,
  });
  return filterList;
};
