import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  BeachAccessOutlined,
  ComputerOutlined,
  FlightOutlined,
  MeetingRoomOutlined,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "../../Components/common/common.css";
import { ContactService } from "../../data/services";
import { CalendarService } from "../../data/services/CalendarService";
import { showSnackbar, updateDrawerMenu } from "../../Store/actions";
import { MENU_DASHBOARD } from "../common/AppBar/DCAppBar";
import EmptyView from "../EmptyView/EmptyView";
import TwitterTimeLine from "../TwitterWidget/TwitterTimeLine";
import CalendarItem from "./CalendarItem";
import DashboardCard from "./DashboardCard";
import DashboardLoader from "./DashBoardLoader";
import { BARODA_OFFICE_ID } from "../../common/AppConstant";
import CircularLoader from "../common/CircularLoader";
const styles = (theme) => ({
  paper: {
    padding: 12,
    textAlign: "center",
  },
});

class Dashboard extends React.Component {
  state = {
    isLoading: true,
    dashboard: {
      meetings: 0,
      leave_info: {
        total_leaves: 0,
        total_used: 0,
        balance: 0,
      },
      time_off: 0,
      time_tracker: 0.0,
    },
    calendar: {
      anniversary: [],
      birthdays: [],
      holidays: [],
      leaves: [],
    },
    allCalendar: [],
  };

  setLoadingFalse = () => {
    this.setState({
      isLoading: false,
    });
  };
  componentDidMount() {
    // this.props.openSnackbar('Dashboard');
    this.props.changeDrawerMenu(MENU_DASHBOARD);
    ContactService.getDashboard()
      .then((response) => {
        // console.debug('Dashboard',response.values)
        this.setLoadingFalse();
        let mDashboard = response.values;
        this.setState({
          dashboard: mDashboard,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setLoadingFalse();
      });

    CalendarService.getTodaysCalendar().then((response) => {
      let mEntries = [];

      response.values.anniversary.map((value, index) => {
        return mEntries.push(value);
      });
      response.values.birthdays.map((value, index) => {
        return mEntries.push(value);
      });
      response.values.holidays.map((value, index) => {
        return mEntries.push(value);
      });
      response.values.leaves.map((value, index) => {
        return mEntries.push(value);
      });

      // mEntries.push(response.values.anniversary);
      // mEntries.push(response.values.birthdays);
      // mEntries.push(response.values.holidays);
      // mEntries.push(response.values.leaves);

      // console.debug('All Calendar', mEntries.length, mEntries);
      if (response.status === 1) {
        this.setState({
          calendar: response.values,
          allCalendar: mEntries,
        });
      }
    });
  }

  getCard = (classes, icon, title, body, footer) => {
    return (
      <Grid item xs={3}>
        <Paper className={classes.paper}>
          <React.Fragment>
            <ListItem>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                style={{ textAlign: "start" }}
                primary={<Typography variant="h6">{title}</Typography>}
              />
            </ListItem>
            <Typography color={"primary"} variant="h6" gutterBottom>
              {body}
            </Typography>
            <Typography variant="subtitle2">{footer}</Typography>
          </React.Fragment>
        </Paper>
      </Grid>
    );
  };

  handleDashboardCard = (path) => {
    window.open(path);
    // this.props.history.push(path);
  };

  getDashboardUi = () => {
    const { classes, employee } = this.props;
    var timeOffHours;
    const { dashboard } = this.state;
    if (employee.office_location === BARODA_OFFICE_ID) {
      timeOffHours =
        parseFloat(dashboard.leave_info.total_used) +
        parseFloat(dashboard.leave_info.total_pending);
    } else {
      timeOffHours = dashboard.leave_info.used_leaves;
    }
    return (
      <div style={{ marginTop: "16px" }}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
        <Grid item xs={4}>
            <Link to={`/timeoff`} className={"link"}>
              <DashboardCard
                icon={<BeachAccessOutlined color="primary" />}
                title={"Time Off"}
                body={this.state.isLoading ? 
                  <CircularLoader/>:
                  parseFloat(timeOffHours).toFixed(1) +
                  "/" +
                  parseFloat(dashboard.leave_info.total_leaves).toFixed(1)
                }
                summary="Leave(s) taken"
              />
            </Link>
          </Grid>
          <Grid item xs={4}>
            <DashboardCard
              onClick={() =>
                this.handleDashboardCard(
                  "https://devtracker.devdigital.com/index.php?route=common/timetracker"
                )
              }
              icon={<ComputerOutlined color="primary" />}
              title={"Time Card"}
              body={this.state.isLoading ? 
                <CircularLoader/>:this.state.dashboard.time_tracker}
              summary="Currently logged Hours"
            />
          </Grid>
          {employee.has_timeoff_request_access && (
            <Grid item xs={4}>
              <Link to={`/timeoffrequest`} className={"link"}>
                <DashboardCard
                  icon={<FlightOutlined color="primary" />}
                  title={"Time Off Requests"}
                  body={this.state.isLoading ? 
                    <CircularLoader/>:this.state.dashboard.time_off}
                  summary="Pending for approval"
                />
              </Link>
            </Grid>
          )}

          <Grid item xs={6}>
            <Paper className={classes.paper} style={{ textAlign: "start" }}>
              <Typography variant={"h6"}>Calendar Events</Typography>
              <List>
                {this.state.isLoading ? 
                  <CircularLoader/>:
                this.state.allCalendar.length === 0 ? (
                  <EmptyView title="" message="Nothing on board!" />
                ) : (
                  this.state.allCalendar.map((agenda, index) => {
                    return (
                      <CalendarItem
                        key={agenda.id}
                        agenda={agenda}
                        onClick={(id) => {
                          this.props.history.push(`/employees/${id}`);
                        }}
                      />
                    );
                  })
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            {
              <Paper>
                <TwitterTimeLine
                  sourceType="widget"
                  screenName="dev_digital"
                  noHeader
                  noFooter
                  noScrollbar
                  options={{ tweetLimit: "3" }}
                />
              </Paper>
            }
          </Grid>
        </Grid>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Typography variant={"h5"}>Dashboard</Typography>
         {this.getDashboardUi()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employee: state.usr.employee,
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
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
