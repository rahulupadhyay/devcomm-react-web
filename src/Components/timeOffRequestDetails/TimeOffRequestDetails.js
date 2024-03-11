import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  IconButton,
  ListItemText,
  Avatar,
} from "@material-ui/core";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import { withStyles } from "@material-ui/core/styles";
import SkeletonLoading from "../Loaders/SkeletonLoading";
import { colors } from "../../common/colors";
import { TimeTrackerService } from "../../data/services";
import { showSnackbar } from "../../Store/actions";
import ContainerCard from "./ContainerCard";
import moment from "moment";

import { getCurrentDate } from "../../common/MomentUtils";
import { _getStatusColor } from "../TimeOff/FilterUtils";
import { find } from "lodash";
import { ProgressDialog } from "../Dialogs";
import { BARODA_OFFICE_ID } from "../../common/AppConstant";
import CircularLoader from "../common/CircularLoader";
const strings = {
  title: "Time Off Details",
  hours: "Hour(s)",
  days: "Day(s)",
  pending: "Pending",
  approved: "Approved",
  total: "Total",
  casual: "Casual",
  earned: "Earned",
  sick: "Sick",
  carry_forward: "Carry Forward",
  used: "Used",
  balance: "Balance",
};

class TimeOffRequestDetails extends React.Component {
  state = {
    isLoading: true,
    isFetching: false,
    timeOffId: "",
    data: {},
    managers: [],
    selectedManager: "",
    showManagerError: false,
    leaveInfoCards: [],
    workflowList: [],
    comment: "",
    showCommentError: false,
  };

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    this._fetchMyManagers();
    if (this.props.location.state !== undefined) {
      var data = this.props.location.state.data;

      var tmpList = [];
      tmpList.push({
        user_name: data.user_name,
        user_id: data.leave_info.employee_id,
        status: "Requested",
        details: "",
        created_on: data.created_on,
        user_image: data.avatar,
      });

      if (data.workflow != null) {
        tmpList.push(...data.workflow.reverse());
      }

      var mViewOnly = this.props.employee.employee_id === data.requested_by;

      this.setState({
        leaveInfoCards: this._generateLeaveInfo(
          data.office_location,
          data.leave_info
        ),
        timeOffId: params.id,
        data: data,
        workflowList: tmpList,
      });
    }
  }

  _goToBack = () => {
    this.props.history.goBack();
  };

  _fetchMyManagers = () => {
    TimeTrackerService.getManagers().then((response) => {
      this.setState({ isLoading: false, managers: response.values });
    });
  };

  _generateLeaveInfo = (officeID, data) => {
    var temp = [];
    if (officeID === BARODA_OFFICE_ID) {
      temp = [
        {
          title: strings.total,
          leaveInfo: this._parseHours(data.total_used, data.total_leaves),
          color: colors.light_blue_300,
        },
        {
          title: strings.sick,
          leaveInfo: this._parseHours(data.used_sick_leaves, data.sick_leave),
          color: colors.red_300,
        },
        {
          title: strings.casual,
          leaveInfo: this._parseHours(
            data.used_casual_leaves,
            data.casual_leave
          ),
          color: colors.orange_300,
        },
      ];

      if (parseFloat(data.paid_leave) > 0) {
        var usedEarned = this._addHours(
          data.pending_paid_leaves,
          data.used_paid_leaves
        );
        temp.push({
          title: strings.earned,
          leaveInfo: usedEarned + "/" + this._parseHour(data.paid_leave),
          color: colors.green_300,
        });
      }

      if (parseFloat(data.balance) > 0) {
        var usedCF = this._addHours(data.pending_balance, data.used_balance);
        temp.push({
          title: strings.carry_forward,
          leaveInfo: usedCF + "/" + this._parseHour(data.balance),
          color: colors.indigo_300,
        });
      }
    } else {
      temp = [
        {
          title: strings.total,
          leaveInfo: this._parseHour(data.total_leaves),
          color: colors.light_blue_300,
        },
        {
          title: strings.used,
          leaveInfo: this._parseHour(data.used_leaves),
          color: colors.green_300,
        },
        {
          title: strings.balance,
          leaveInfo: this._parseHour(data.balance_leaves),
          color: colors.orange_300,
        },
      ];
    }
    return temp;
  };

  _parseHours = (h1, h2) => {
    return parseFloat(h1).toFixed(1) + "/" + parseFloat(h2).toFixed(1);
  };

  _parseHour = (h) => parseFloat(h).toFixed(1);

  _addHours = (h1, h2) => {
    return (parseFloat(h1) + parseFloat(h2)).toFixed(1);
  };

  _fetchTimeOffData = async (id) => {
    TimeTrackerService.getTimeOffDetails(id).then((response) => {
      var tmpList = [];
      const { employee } = this.props;
      tmpList.push({
        user_name: employee.first_name + " " + employee.last_name,
        user_id: employee.employee_id,
        status: "Requested",
        details: "",
        created_on: response.values.created_on,
        user_image: employee.Image,
      });
      if (response.values.workflow != null) {
        tmpList.push(...response.values.workflow.reverse());
      }
      this.setState({
        isLoading: false,
        data: response.values,
        workflowList: tmpList,
      });
    });
  };

  _onCancelTimeOff = () => {
    const { data } = this.state;
    this.setState({ isLoading: true });
    TimeTrackerService.cancelLeaveRequest(data.timeoff_id).then((response) => {
      this.props.openSnackbar(response.message);

      if (response.status === 1) {
        this._fetchTimeOffData(this.state.timeOffId);
      }
    });
  };

  _openAttach = () => {
    var url = this.state.data.document_file;
    window.open(url, "_blank");
  };

  _onCommentTextChange = (event) => {
    this.setState({ comment: event.target.value }, () => {
      if (this.state.showCommentError && this.state.comment.length > 0) {
        this.setState({ showCommentError: false });
      }
    });
  };

  _handleManagerChange = (event) => {
    this.setState({ selectedManager: event.target.value });
  };

  _validateData = () => {
    const { comment, managers, selectedManager } = this.state;
    var showCommentError = false;
    var showManagerError = false;

    if (comment.length === 0) showCommentError = true;

    if (managers.length > 0 && selectedManager.length === 0)
      showManagerError = true;

    var isValid = false;

    if (!showCommentError && !showManagerError) isValid = true;

    this.setState({ showCommentError, showManagerError });

    return isValid;
  };

  _onApproveOrDenyButton = (isApprove) => {
    if (!this._validateData()) return;
    const { selectedManager, managers } = this.state;
    var manager = find(managers, (m) => m.user_name === selectedManager);
    const param = {
      tl_hod: manager ? manager.user_id : "",
      details: this.state.comment,
      request_action: isApprove ? "Approved" : "Denied",
      request_id: this.state.timeOffId,
      requsted_user_id: this.state.data.requested_by,
    };

    this.setState({ isFetching: true });
    TimeTrackerService.approveOrDeclineTimeOff(param).then((response) => {
      this.props.openSnackbar(response.message);

      if (response.status === 1)
        this.setState({ isFetching: false }, this._goToBack);
    });
  };

  _hasCancelAccess = () => {
    const { data } = this.state;
    const { employee } = this.props;
    var currentDate = getCurrentDate();
    var isBefore = moment(currentDate).isBefore(data.start_date);

    var cancelAccess =
      employee.id === data.requested_by &&
      isBefore &&
      (data.status === strings.approved || data.status === strings.pending);

    return cancelAccess;
  };

  renderHeader = () => (
    <Grid>
      <IconButton
        style={{ marginBottom: 6 }}
        color="inherit"
        onClick={this._goToBack}
      >
        <BackIcon />
      </IconButton>
      <Typography align="center" display="inline" variant={"h5"}>
        {strings.title}
      </Typography>
    </Grid>
  );

  renderTopCard = () => {
    const { data, leaveInfoCards } = this.state;
    const { classes, employee } = this.props;

    var size = leaveInfoCards ? leaveInfoCards.length : 0;

    return (
      <div style={{ margin: "8px", padding: 12 }}>
        <Grid container>
          <Avatar src={data.avatar} className={classes.large} />
          <Grid item className={classes.nameContainer}>
            <ListItemText
              primary={
                <Typography className={classes.title}>
                  {data.user_name}
                </Typography>
              }
              secondary={
                <Typography className={classes.bold}>
                  {data.user_role + " | " + data.department}
                </Typography>
              }
            />
          </Grid>
          <Grid
            item
            style={{
              display: "inherit",
              flexDirection: "row",
              border: 1,
              borderColor: colors.grey_300,
              borderRadius: 8,
              borderStyle: "solid",
              paddingLeft: size > 4 ? 18 : 36,
              margin: 8,
              alignItems: "center",
            }}
          >
            {leaveInfoCards.map((l, index) => (
              <ListItemText
                key={index}
                style={{ marginRight: size > 4 ? 18 : 36 }}
                primary={
                  <Typography variant={size > 4 ? "h6" : "h5"}>
                    {l.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    style={{ marginTop: 6, color: l.color }}
                    variant={size > 4 ? "h6" : "h5"}
                  >
                    {l.leaveInfo}
                  </Typography>
                }
              />
            ))}
          </Grid>
        </Grid>
      </div>
    );
  };

  renderContainerCard = () => {
    return (
      <ContainerCard
        isLoading={this.state.isLoading}
        data={this.state.data}
        employee={this.props.employee}
        workflowList={this.state.workflowList}
        hasCancelAccess={this._hasCancelAccess()}
        onCancelTimeOff={this._onCancelTimeOff}
        openAttach={this._openAttach}
        managers={this.state.managers}
        selectedManager={this.state.selectedManager}
        handleManagerChange={this._handleManagerChange}
        showManagerError={this.state.showManagerError}
        onCommentTextChange={this._onCommentTextChange}
        showCommentError={this.state.showCommentError}
        onApproveOrDenyButton={this._onApproveOrDenyButton}
      />
    );
  };

  render() {
    return (
      <div style={{ marginTop: "8px" }}>
        {this.renderHeader()}
        {this.renderTopCard()}
        {this.renderContainerCard()}
        <ProgressDialog open={this.state.isFetching} />
      </div>
    );
  }
}

const styles = (theme) => ({
  title: {
    fontWeight: "bold",
    fontSize: 32,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.grey_800,
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    alignSelf: "center",
  },
  nameContainer: {
    marginLeft: 36,
    marginRight: 36,
  },
  leaveCardContainer: {
    display: "inherit",
    flexDirection: "row",
    border: 1,
    borderColor: colors.grey_300,
    borderRadius: 8,
    borderStyle: "solid",
    paddingLeft: 36,
    margin: 8,
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    employee: state.usr.employee,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar: (message) =>
      dispatch(showSnackbar({ open: true, message: message })),
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(TimeOffRequestDetails)
);
