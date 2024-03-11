import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "../Components/Dashboard/Dashboard";
import Employees from "../Components/Employees/Employees";
import Albums from "../Components/Albums/Albums";

import CssBaseline from "@material-ui/core/es/CssBaseline/CssBaseline";
import MenuAppBar from "../Components/common/AppBar/DCAppBar";
import withStyles from "@material-ui/core/es/styles/withStyles";
import EmployeeDetails from "../Components/EmployeeDetails/EmployeeDetails";
import EOM from "../Components/EOM/EOM";
import UpdateProfile from "../Components/Profile/UpdateProfile";
import Skills from "../Components/Profile/Skills";
import { getUserData, isLoggedIn } from "../data/storage";
import Meetings from "../Components/Meeting/Meetings";
import MeetingDetails from "../Components/Meeting/MeetingDetails";
import CreateMeeting from "../Components/Meeting/CreateMeeting";
import AddAlbum from "../Components/Albums/AddAlbum";
import { MessageDialog, ProgressDialog } from "../Components/Dialogs";
import { showDialog, showSnackbar } from "../Store/actions";
import AddVote from "../Components/EOM/AddVote";
import DeclareEOMView from "../Components/EOM/DeclareEOMView";
import SnackBar from "../Components/common/SnackBar";
import Holidays from "../Components/Holiday/Holidays";

import TimeOff from "../Components/TimeOff/TimeOff";
import TimeOffDetails from "../Components/TimeOffDetails/TimeOffDetails";
import TimeOffApply from "../Components/timeOffApply/TimeOffApply";
import TimeOffRequest from "../Components/timeOffRequest/TimeOffRequest";
import TimeOffRequestDetails from "../Components/timeOffRequestDetails/TimeOffRequestDetails";
import Settings from "../Components/Settings/Settings";

const styles = (theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
    marginLeft: "280px",
    padding: theme.spacing(3),
    margin: 48,
    overflow: "auto",
  },
  appBarSpacer: theme.mixins.toolbar,
  h5: {
    marginBottom: theme.spacing(2),
  },
});

class MainPage extends Component {
  state = {
    menuOpen: false,
  };

  render() {
    // console.debug(isLoggedIn());
    if (isLoggedIn() === null || isLoggedIn() === "false") {
      return <Redirect to="/login" />;
    }

    let employee = JSON.parse(getUserData());
    const { classes } = this.props;
    // console.debug("isLoggedIn", isLoggedIn());
    return (
      <div className={classes.root}>
        <CssBaseline />
        <MenuAppBar history={this.props.history} employee={employee} />
        <main className={classes.content}>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/employees" component={Employees} />
            <Route exact path="/employees/:id?" component={EmployeeDetails} />
            <Route path="/albums" component={Albums} />
            <Route exact path="/eom" component={EOM} />
            <Route exact path="/eom/vote" component={AddVote} />
            <Route path="/updateprofile" component={UpdateProfile} />
            <Route path="/updateskills" component= {Skills}/>
            <Route exact path="/meetings" component={Meetings} />
            <Route exact path="/meetings/:id?" component={MeetingDetails} />
            <Route exact path="/holidays" component={Holidays} />
            <Route exact path="/settings" component={Settings} />
            
            <Route exact path="/timeoff" component={TimeOff} />
            <Route exact path="/timeoff/:id?" component={TimeOffDetails} />
            <Route exact path="/applyleave" component={TimeOffApply} />
            <Route exact path="/timeoffrequest" component={TimeOffRequest} />
            <Route
              exact
              path="/timeoffrequest/:id"
              component={TimeOffRequestDetails}
            />
            <Route
              exact
              path="/meetings/meeting/add"
              component={CreateMeeting}
            />
          </Switch>
          <Route path="/albums/add" component={AddAlbum} />
          <Route path="/eom/add" component={DeclareEOMView} />

          <MessageDialog
            title={this.props.title}
            message={this.props.description}
            openMessageDialog={this.props.isOpen}
            closeMessageDialog={this.props.closeDialog}
          />
          <ProgressDialog open={this.props.showProgress} />

          <SnackBar
            message={this.props.snackbarMessage}
            variant={this.props.snackBarVariant}
            openSnackbar={this.props.showSnackBar}
            hideSnackbar={this.props.closeSnackbar}
          />
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.usr.loggedIn,
    isOpen: state.dlg.isOpen,
    title: state.dlg.title,
    description: state.dlg.description,
    showProgress: state.dlg.showProgress,
    showSnackBar: state.snb.open,
    snackBarVariant: state.snb.variant,
    snackbarMessage: state.snb.message,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeDialog: () => dispatch(showDialog({ open: false })),
    closeSnackbar: () => dispatch(showSnackbar({ open: false })),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MainPage)
);
