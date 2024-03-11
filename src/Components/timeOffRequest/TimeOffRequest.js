import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, IconButton, Paper } from "@material-ui/core";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import FilterIcon from "@material-ui/icons/FilterList";
import { withStyles } from "@material-ui/core/styles";
import { filter, partition, find } from "lodash";
import moment from "moment";
import SkeletonLoading from "../Loaders/SkeletonLoading";
import { colors } from "../../common/colors";
import LeaveCard from "./LeaveCard";
import { TimeTrackerService, ContactService } from "../../data/services";
import { showSnackbar, updateDrawerMenu } from "../../Store/actions";
import EmptyView from "../EmptyView/EmptyView";
import FilterView from "../TimeOff/FilterView";
import {
  LEAVE_TIME,
  LEAVE_TYPE,
  LEAVE_STATUS,
  generateFilters,
} from "../TimeOff/FilterUtils";
import { getCurrentDate } from "../../common/MomentUtils";
import { MENU_TIME_OFF_REQUEST } from "../common/AppBar/DCAppBar";
import { storeContacts } from "../../Store/actions/employeesActions";
import CircularLoader from "../common/CircularLoader";
const strings = {
  title: "Time Off Request",
  apply: "APPLY",
  year: "Year",
  filter: "Filter",
  upcoming: "Upcoming",
  past: "Past",
  fullDay: "Full Day",
  halfDay: "Half Day",
};

class TimeOffRequest extends React.Component {
  state = {
    isLoading: true,
    leaveInfoCards: [],
    leaves: [],
    filteredLeaves: [],
    showFilter: false,
    selectedFilter: generateFilters(),
  };

  componentDidMount() {
    this.props.changeDrawerMenu(MENU_TIME_OFF_REQUEST);
    const { contacts } = this.props;

    if (contacts && contacts.length > 0) {
      this._fetchTimeOffData();
    } else {
      this._getAllContacts();
    }
  }

  _goToBack = () => {
    this.props.history.goBack();
  };

  _goToDetails = (data) => {
    console.log("_goToDetails-->", data);
    this.props.history.push({
      pathname: "/timeoffrequest/" + data.timeoff_id,
      state: { data: data },
    });
  };

  _getAllContacts = () => {
    ContactService.getContacts().then((response) => {
      var allMembers = [];
      response.values.forEach((data, index) => {
        let member = {
          id: data.id,
          avatar: data.Image,
          department: data.department,
          user_role: data.user_role,
          office_location: data.office_location,
        };

        allMembers.push(member);
      });
      this.props.storeContacts(allMembers);
      this._fetchTimeOffData();
    });
  };

  _fetchTimeOffData = () => {
    TimeTrackerService.getTimeOffReqList(moment().year()).then((response) => {
      var tmpLeaves = this._sortDescending(response.values);
      const { contacts } = this.props;
      var tmp = this.state.selectedFilter;
      tmp.forEach((f) => {
        if (f.id === 8) f.isSelected = true;
      });

      tmpLeaves.forEach((l) => {
        var member = find(contacts, (c) => l.requested_by === c.id);

        if (member) {
          l.avatar = member.avatar;
          l.department = member.department;
          l.user_role = member.user_role;
          l.office_location = member.office_location;
        }
      });

      this.setState(
        {
          isLoading: false,
          leaves: tmpLeaves,
          filteredLeaves: tmpLeaves,
          selectedFilter: tmp,
        },
        this._filterLeaves
      );
    });
  };

  _onFilterClick = () => this.setState({ showFilter: !this.state.showFilter });

  _clearFilter = () => {
    var tmp = this.state.selectedFilter;
    tmp.map((f) => (f.isSelected = false));
    this.setState({ selectedFilter: tmp, filteredLeaves: this.state.leaves });
  };

  _addRemoveFilter = (filter) => {
    console.log("_addRemoveFilter->", filter);
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
      return dateA - dateB;
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
    const { filteredLeaves } = this.state;

    return (
      <div style={{ marginTop: "8px" }}>
        <Grid style={{ marginTop: 16 }} container>
          <Grid style={{ alignSelf: "center" }} item xs={6}>
            <IconButton
              style={{ marginBottom: 6 }}
              color="inherit"
              onClick={this._goToBack}
            >
              <BackIcon />
            </IconButton>
            <Typography display="inline" variant={"h5"}>
              {strings.title}
            </Typography>
          </Grid>

          <Grid style={{ textAlign: "end" }} item xs={6}>
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
    contacts: state.eom.contacts,
    showProgress: state.dlg.showProgress,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar: (message) =>
      dispatch(showSnackbar({ open: true, message: message })),
    changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index)),
    storeContacts: (contacts) => dispatch(storeContacts(contacts)),
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(TimeOffRequest)
);
