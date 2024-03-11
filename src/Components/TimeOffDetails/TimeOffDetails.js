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

import { colors } from "../../common/colors";
import { TimeTrackerService } from "../../data/services";
import { showSnackbar } from "../../Store/actions";
import ContainerCard from "./ContainerCard";
import moment from "moment";

import { getCurrentDate } from "../../common/MomentUtils";
import { _getStatusColor } from "../TimeOff/FilterUtils";

const strings = {
  title: "Time Off Details",
  hours: "Hour(s)",
  days: "Day(s)",
  pending: "Pending",
  approved: "Approved",
};

class TimeOffDetails extends React.Component {
  state = {
    isLoading: true,
    timeOffId: "",
    documentFile: "",
    data: {},
    leaveInfoCards: [],
    workflowList: [],
  };

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    if (this.props.location.state !== undefined) {
      this.setState({
        leaveInfoCards: this.props.location.state.leaveInfoCards,
        timeOffId: params.id,
        documentFile: this.props.location.state.documentFile,
      });
      this._fetchTimeOffData(params.id);
    }
  }

  _goToBack = () => {
    this.props.history.goBack();
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
    var url = this.state.documentFile;
    window.open(this.state.documentFile, "_blank");
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
    var timeOffHours;
    if (parseFloat(data.hours) >= 9.0)
      timeOffHours = data.leave_day + " " + strings.days;
    else timeOffHours = data.hours + " " + strings.hours;

    return (
      <div style={{ margin: "8px", padding: 12 }}>
        <Grid container>
          <Avatar src={employee.Image} className={classes.large} />
          <Grid item className={classes.nameContainer}>
            <ListItemText
              primary={
                <Typography className={classes.title}>
                  {employee.first_name + " " + employee.last_name}
                </Typography>
              }
              secondary={
                <Typography className={classes.bold}>
                  {employee.department}
                </Typography>
              }
            />
          </Grid>
          <Grid item className={classes.leaveCardContainer}>
            {leaveInfoCards.map((l, index) => (
              <ListItemText
                key={index}
                style={{ marginRight: 36 }}
                primary={<Typography variant="h5">{l.title}</Typography>}
                secondary={
                  <Typography
                    style={{ marginTop: 6, color: l.color }}
                    variant="h5"
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
      />
    );
  };

  render() {
    return (
      <div style={{ marginTop: "8px" }}>
        {this.renderHeader()}
        {this.renderTopCard()}
        {this.renderContainerCard()}
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
  connect(mapStateToProps, mapDispatchToProps)(TimeOffDetails)
);
