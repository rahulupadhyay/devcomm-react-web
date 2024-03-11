import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Fab,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import FilterIcon from "@material-ui/icons/FilterList";
import { withStyles } from "@material-ui/core/styles";
import { filter, partition } from "lodash";
import SkeletonLoading from "../Loaders/SkeletonLoading";
import TimeOffCard from "./TimeOffCard";
import { BARODA_OFFICE_ID } from "../../common/AppConstant";
import { colors } from "../../common/colors";
import LeaveCard from "./LeaveCard";
import { Link } from "react-router-dom";
import { TimeTrackerService } from "../../data/services";
import { showSnackbar, updateDrawerMenu } from "../../Store/actions";
import EmptyView from "../EmptyView/EmptyView";
import { MENU_TIME_OFF_TRACKER } from "../common/AppBar/DCAppBar";
import FilterView from "./FilterView";
import { generateFilters } from "./FilterUtils";
import { LEAVE_TIME, LEAVE_TYPE, LEAVE_STATUS } from "./FilterUtils";
import { getCurrentDate } from "../../common/MomentUtils";
import CircularLoader from "../common/CircularLoader";
const strings = {
  title: "Time Off Tracker",
  total: "Total",
  casual: "Casual",
  earned: "Earned",
  sick: "Sick",
  carry_forward: "Carry Forward",
  used: "Used",
  balance: "Balance",
  title_leave_request: "Leave Requests",
  apply: "APPLY",
  year: "Year",
  filter: "Filter",
  upcoming: "Upcoming",
  past: "Past",
  fullDay: "Full Day",
  halfDay: "Half Day",
};

class TimeOff extends React.Component {
  state = {
    isLoading: true,
    leaveInfoCards: [],
    leaves: [],
    filteredLeaves: [],
    selectedYear: "2022",
    showFilter: false,
    selectedFilter: generateFilters(),
  };

  componentDidMount() {
    this.props.changeDrawerMenu(MENU_TIME_OFF_TRACKER);
    this._fetchTimeOffData();
  }

  _goToDetails = (data) => {
    console.log(
      "this.state.leaveInfoCards",
      JSON.stringify(this.state.leaveInfoCards)
    );
    this.props.history.push({
      pathname: "/timeoff/" + data.timeoff_id,
      state: {
        leaveInfoCards: this.state.leaveInfoCards,
        documentFile: data.document_file,
      },
    });
  };

  _goToApply = () => {
    this.props.history.push("/applyleave");
  };

  _fetchTimeOffData = async () => {
    const { selectedYear } = this.state;
    TimeTrackerService.getTimeOffList(selectedYear).then((response) => {
      var tmpData = this._generateLeaveInfoCardData(response.attrs.leave_info);
      var tmpLeaves = this._sortDescending(response.values);

      this.setState({
        isLoading: false,
        leaveInfoCards: tmpData,
        leaves: tmpLeaves,
        filteredLeaves: tmpLeaves,
      });
    });
  };

  _fetchLeaves = async () => {
    this.setState({ isLoading: true });
    const { selectedYear } = this.state;
    TimeTrackerService.getTimeOffList(selectedYear).then((response) => {
      var tmpLeaves = this._sortDescending(response.values);
      this.setState({
        isLoading: false,
        leaves: tmpLeaves,
        filteredLeaves: tmpLeaves,
      });
    });
  };

  _addHours = (h1, h2) => {
    return (parseFloat(h1) + parseFloat(h2)).toFixed(1);
  };

  _parseHour = (h) => parseFloat(h).toFixed(1);

  _generateLeaveInfoCardData = (data) => {
    const { office_location } = this.props.employee;
    var leaveInfoList = [];
    if (office_location === BARODA_OFFICE_ID) {
      var usedTotal = this._addHours(data.total_used, data.total_pending);
      leaveInfoList.push({
        title: strings.total,
        leaveInfo: usedTotal + "/" + this._parseHour(data.total_leaves),
        color: colors.light_blue_300,
      });

      var usedSick = this._addHours(
        data.pending_sick_leaves,
        data.used_sick_leaves
      );
      leaveInfoList.push({
        title: strings.sick,
        leaveInfo: usedSick + "/" + this._parseHour(data.sick_leave),
        color: colors.red_300,
      });

      if (parseFloat(data.paid_leave) > 0) {
        var usedEarned = this._addHours(
          data.pending_paid_leaves,
          data.used_paid_leaves
        );
        leaveInfoList.push({
          title: strings.earned,
          leaveInfo: usedEarned + "/" + this._parseHour(data.paid_leave),
          color: colors.green_300,
        });
      }

      var usedCasual = this._addHours(
        data.pending_casual_leaves,
        data.used_casual_leaves
      );
      leaveInfoList.push({
        title: strings.casual,
        leaveInfo: usedCasual + "/" + this._parseHour(data.casual_leave),
        color: colors.orange_300,
      });

      if (parseFloat(data.balance) > 0) {
        var usedCF = this._addHours(data.pending_balance, data.used_balance);
        leaveInfoList.push({
          title: strings.carry_forward,
          leaveInfo: usedCF + "/" + this._parseHour(data.balance),
          color: colors.indigo_300,
        });
      }
    } else {
      leaveInfoList.push({
        title: strings.total,
        leaveInfo: this._parseHour(data.total_leaves),
        color: colors.light_blue_300,
      });
      leaveInfoList.push({
        title: strings.used,
        leaveInfo: this._parseHour(data.used_leaves),
        color: colors.green_300,
      });
      leaveInfoList.push({
        title: strings.balance,
        leaveInfo: this._parseHour(data.balance_leaves),
        color: colors.orange_300,
      });
    }

    return leaveInfoList;
  };

  _handleChange = (event) => {
    if (this.state.selectedYear !== event.target.value) {
      this.setState({ selectedYear: event.target.value }, () =>
        this._fetchLeaves()
      );
    }
  };

  _onFilterClick = () => this.setState({ showFilter: !this.state.showFilter });

  _clearFilter = () => {
    var tmp = this.state.selectedFilter;
    tmp.map((f) => (f.isSelected = false));
    this.setState({ selectedFilter: tmp, filteredLeaves: this.state.leaves });
  };

  _addRemoveFilter = (filter) => {
    var tmp = this.state.selectedFilter;
    tmp.forEach((f) => {
      if (f.id === filter.id) f.isSelected = !f.isSelected;
    });
    this.setState({ selectedFilter: tmp }, this._filterLeaves);
  };

  _sortDescending = (tmpLeaves) => {
    return tmpLeaves.sort(function compare(a, b) {
      var dateA = new Date(a.start_date);
      var dateB = new Date(b.start_date);
      return dateB - dateA;
    });
  };

  _getSelectedFilter = (type) => {
    return filter(this.state.selectedFilter, { isSelected: true, type });
  };

  _filterLeaves = () => {
    const { leaves } = this.state;
    var selectedLeaveTimeFilter = this._getSelectedFilter(LEAVE_TIME);
    var selectedLeaveStatusFilter = this._getSelectedFilter(LEAVE_STATUS);
    var selectedLeaveTypeFilter = this._getSelectedFilter(LEAVE_TYPE);

    var timeLeaves = [];
    if (selectedLeaveTimeFilter.length > 0) {
      var todayDate = getCurrentDate();
      var tmpList = partition(leaves, (it) => it.start_date > todayDate);
      selectedLeaveTimeFilter.forEach((l) => {
        if (l.label === strings.upcoming) timeLeaves.push(...tmpList[0]);
        else if (l.label === strings.past) timeLeaves.push(...tmpList[1]);
        else timeLeaves.push(...leaves);
      });
    } else timeLeaves.push(...leaves);

    var statusLeaves = [];
    if (selectedLeaveStatusFilter.length > 0) {
      selectedLeaveStatusFilter.forEach((l) => {
        timeLeaves
          .filter((it) => it.status === l.label)
          .forEach((tmp) => statusLeaves.push(tmp));
      });
    } else statusLeaves.push(...timeLeaves);

    var typeLeaves = [];
    if (selectedLeaveTypeFilter.length > 0) {
      var tmpType = partition(statusLeaves, (it) => parseFloat(it.hours) > 4.5);
      selectedLeaveTypeFilter.forEach((l) => {
        if (l.label === strings.fullDay) typeLeaves.push(...tmpType[0]);
        else if (l.label === strings.halfDay) typeLeaves.push(...tmpType[1]);
        else typeLeaves.push(...leaves);
      });
    } else typeLeaves.push(...statusLeaves);

    this.setState({ filteredLeaves: this._sortDescending(typeLeaves) });
  };

  renderFilterView = () => {
    return (
      <FilterView
        selectedFilter={this.state.selectedFilter}
        closeFilter={this._onFilterClick}
        clearFilter={this._clearFilter}
        addRemoveFilter={this._addRemoveFilter}
      />
    );
  };

  render() {
    const { classes } = this.props;
    const { leaveInfoCards, filteredLeaves } = this.state;

    return (
      <div style={{ marginTop: "8px" }}>
        <Typography variant={"h5"}>{strings.title}</Typography>

        <Grid style={{ marginTop: 16 }} container>
          {this.state.isLoading? <TimeOffCard
              isLoading={this.state.isLoading}
              key={0}
              title={"Total"}
              leaveInfo={"leave.leaveInfo"}
              color={"leave.color"}
            /> : leaveInfoCards.map((leave, index) => (
            <TimeOffCard
              isLoading={this.state.isLoading}
              key={index}
              title={leave.title}
              leaveInfo={leave.leaveInfo}
              color={leave.color}
            />
          ))}
        </Grid>

        <Grid style={{ marginTop: 16 }} container>
          <Grid style={{ alignSelf: "center" }} item xs={6}>
            <Typography variant={"h5"}>
              {strings.title_leave_request}
            </Typography>
          </Grid>

          <Grid style={{ textAlign: "end" }} item xs={6}>
            <Typography display="inline" variant={"h6"}>
              {strings.year}
            </Typography>
            <Select
              value={this.state.selectedYear}
              style={{ marginLeft: 8, color: colors.green_500 }}
              onChange={this._handleChange}
            >
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2019}>2019</MenuItem>
            </Select>

            <IconButton
              aria-label={strings.filter}
              color="inherit"
              style={{ marginLeft: 24 }}
              onClick={this._onFilterClick}
            >
              <FilterIcon />
            </IconButton>
          </Grid>

          {this.state.showFilter && (
            <Paper container style={{ marginTop: 16, flex: 1 }}>
              {this.renderFilterView()}
            </Paper>
          )}
        </Grid>

        <Grid style={{ marginTop: "16px" }} container direction="column">
          {this.state.isLoading ? 
          <CircularLoader/>:filteredLeaves.length === 0 ? (
            <EmptyView />
          ) : (
            filteredLeaves.map((leave, index) => (
              <LeaveCard
                key={index}
                data={leave}
                goToDetails={this._goToDetails}
              />
            ))
          )}
        </Grid>

        <Link to={"/applyleave"}>
          <Fab
            variant="extended"
            color="secondary"
            aria-label="Add New"
            className={classes.applyFab}
          >
            <AddIcon />
            {strings.apply}
          </Fab>
        </Link>
      </div>
    );
  }
}

const styles = (theme) => ({
  formControl: {
    direction: "row",
    margin: theme.spacing(1),
    minWidth: 240,
  },
  applyFab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    margin: theme.spacing(1),
  },
});

const mapStateToProps = (state) => {
  return {
    employee: state.usr.employee,
    showProgress: state.dlg.showProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar: (message) =>
      dispatch(showSnackbar({ open: true, message: message })),
    changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index)),
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(TimeOff)
);
