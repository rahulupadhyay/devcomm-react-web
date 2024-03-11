import { Avatar, ListItemAvatar, Menu, withStyles } from "@material-ui/core";
import {
  BeachAccessOutlined,
  DashboardOutlined,
  HowToVoteOutlined,
  MeetingRoomOutlined,
  NotificationsOutlined,
  PersonOutlineOutlined,
  PhotoLibraryOutlined,
  PowerSettingsNew,
  SettingsOutlined,
  SupervisedUserCircleOutlined,
  FeedbackOutlined,
  ComputerOutlined,
  FlightOutlined,
} from "@material-ui/icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/es/Button/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import classNames from "classnames";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import Divider from "@material-ui/core/es/Divider/Divider";
import Drawer from "@material-ui/core/es/Drawer/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { AuthService } from "../../../data/services";
import { clearData, getUserId } from "../../../data/storage";
import { hideProgressDialog, showProgressDialog } from "../../../Store/actions";
import NotificationDrawer from "../../Notification/NotificationDrawer";
import UserAvatar from "./UserAvatar";

import "../common.css";
import packageJson from "../../../../package.json";
import { Tooltip } from "@material-ui/core/es";
import { logger } from "../../../common/logger";
import { clearAppData } from "../../../Store/actions/employeesActions";

const drawerWidth = 240;

export const MENU_DASHBOARD = 0;
export const MENU_EMPLOYEES = 1;
export const MENU_MEETINGS = 2;
export const MENU_ALBUMS = 3;
export const MENU_EOM = 4; // No longer needed.
export const MENU_HOLIDAYS = 5;
export const MENU_SETTINGS = 6;
export const MENU_TIME_TRACKER = 7;
export const MENU_TIME_OFF_TRACKER = 8;
export const MENU_TIME_OFF_REQUEST = 9;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  drawerPaper: {
    position: "fixed",
    top: 0,
    bottom: 0,
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: "none",
    // transition: theme.transitions.create(['width', 'margin'], {
    //     easing: theme.transitions.easing.sharp,
    //     duration: theme.transitions.duration.leavingScreen,
    // })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    // transition: theme.transitions.create(['width', 'margin'], {
    //     easing: theme.transitions.easing.sharp,
    //     duration: theme.transitions.duration.enteringScreen,
    // }),
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    marginLeft: "16px",
    fontWeight: "bold",
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(2),
  },
  appBarSpacer: theme.mixins.toolbar,
});

class MenuAppBar extends React.Component {
  state = {
    anchorEl: null,
    anchorNotif: null,
    open: true,
    menuOpen: false,
    dialogOpen: false,
  };

  updateSelected(index) {
    //this.setState({ selectedIndex: index })
  }

  handleDrawerToggle = () => {
    const currentState = this.state.open;
    this.setState({ open: !currentState });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  handleDialogClick = () => {
    this.setState({
      dialogOpen: true,
    });
  };
  handleLogout = () => {
    this.props.showProgress();
    AuthService.logout().then((res) => {
      this.props.hideProgress();
      clearData();
      this.props.clearAppData();
      this.props.history.push("/");
    });
  };

  handleOpenMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleNotificationClick = (event) => {
    this.setState({
      anchorNotif: event.currentTarget,
    });
  };
  handleCloseNotifications = () => {
    this.setState({
      anchorNotif: null,
    });
  };

  handleCloseMenu = () => {
    this.setState({
      anchorEl: null,
    });
  };

  toggleMenu = (event) => {
    let mTarget = this.state.anchorEl;
    this.setState({
      anchorEl: mTarget === null ? event.currentTarget : null,
    });
  };

  handleProfileCall = (event) => {
    this.handleCloseMenu();
    const mProfilePath = "/employees/" + getUserId();
    this.props.history.push(mProfilePath);
  };

  handleSignoutCall = () => {
    this.handleCloseMenu();
    this.handleDialogClick();
  };

  handleFeedback = () => {
    window.open("https://forms.gle/DeZhA9uAyRGG3V1n8");
  };

  render() {
    const { classes } = this.props;
    const selectedIndex = this.props.selectedMenu;
    // console.debug('selected', selectedIndex);
    return (
      <div className={classes.root}>
        <AppBar
          color={"inherit"}
          position="fixed"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift
          )}
        >
          <Toolbar
            disableGutters={!this.state.open}
            className={classes.toolbar}
          >
            {window.location.hostname.includes("localhost") ||
            window.location.hostname.includes("staging") ? (
              <Avatar
                className="grayscaleImage"
                src="https://devtracker.devdigital.com/media/devcomm/logo.png"
                alt="logo"
              />
            ) : (
              <Avatar
                src="https://devtracker.devdigital.com/media/devcomm/logo.png"
                alt="logo"
              />
            )}

            <Typography
              variant="h4"
              color="inherit"
              noWrap
              className={classes.title}
            >
              <Link to="/dashboard" className="link">
                DevComm
                {window.location.hostname.includes("localhost") ||
                window.location.hostname.includes("staging") ? (
                  <Typography variant="h6" color="error">
                    STAGING ENVIRONMENT
                  </Typography>
                ) : (
                  ""
                )}
              </Link>
            </Typography>

            <Tooltip title="Send Feedback">
              <IconButton
                aria-label="SendFeedback"
                color="inherit"
                onClick={() => this.handleFeedback()}
              >
                <FeedbackOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                aria-label="Notifications"
                color="inherit"
                onClick={this.handleNotificationClick}
              >
                <NotificationsOutlined />
              </IconButton>
            </Tooltip>
            <NotificationDrawer
              anchorNotif={this.state.anchorNotif}
              handleClose={this.handleCloseNotifications}
            />

            <UserAvatar onClick={this.handleOpenMenu} />

            <Menu
              open={Boolean(this.state.anchorEl)}
              anchorEl={this.state.anchorEl}
              style={{ marginTop: "36px" }}
              onClose={this.handleCloseMenu}
            >
              <div>
                <ListItem dense>
                  <ListItemAvatar>
                    <UserAvatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant={"body1"}>
                        {this.props.employee.first_name +
                          " " +
                          this.props.employee.last_name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant={"body1"}>
                        {this.props.employee.email}
                      </Typography>
                    }
                  />
                </ListItem>
              </div>
              <MenuItem dense onClick={this.handleProfileCall}>
                <ListItem>
                  <ListItemIcon>
                    <PersonOutlineOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant={"body1"}>
                        Manage your account
                      </Typography>
                    }
                  />
                </ListItem>
              </MenuItem>
              <MenuItem dense onClick={this.handleSignoutCall}>
                <ListItem>
                  <ListItemIcon>
                    <PowerSettingsNew />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant={"body1"}>Logout</Typography>}
                  />
                </ListItem>
              </MenuItem>
              <div style={{ textAlign: "center" }}>
                <Typography variant="caption">
                  Version: {packageJson.version}
                </Typography>
              </div>
            </Menu>
          </Toolbar>
          <Divider />
        </AppBar>

        {/* <SideDrawer /> */}
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose
            ),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {/* <DrawerItem title='Dashboard' isSelected={selectedIndex === 0} linkTo="/dashboard" icon={<DashboardOutlined />} onClick={() => this.updateSelected(0)} />
                        <DrawerItem title='Employees' isSelected={selectedIndex === 1} linkTo="/employees" icon={<DashboardOutlined />} onClick={() => this.updateSelected(1)} />
                        <DrawerItem title='Albums' isSelected={selectedIndex === 2} linkTo="/albums" icon={<DashboardOutlined />} onClick={() => this.updateSelected(2)} />
                        <DrawerItem title='EOM' isSelected={selectedIndex === 3} linkTo="/eom" icon={<DashboardOutlined />} onClick={() => this.updateSelected(3)} />
                        <DrawerItem title='Meetings' isSelected={selectedIndex === 4} linkTo="/meetings" icon={<DashboardOutlined />} onClick={() => this.updateSelected(4)} />
                        <DrawerItem title='Holidays' isSelected={selectedIndex === 5} linkTo="/holidays" icon={<DashboardOutlined />} onClick={() => this.updateSelected(0)} /> */}

            <Link to="/dashboard" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_DASHBOARD}
              >
                <ListItem>
                  <ListItemIcon>
                    <DashboardOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </MenuItem>
            </Link>
            <Link to="/timeoff" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_TIME_OFF_TRACKER}
              >
                <ListItem>
                  <ListItemIcon>
                    <BeachAccessOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Time Off Tracker" />
                </ListItem>
              </MenuItem>
            </Link>
            {this.props.employee.has_timeoff_request_access && (
              <Link to="/timeoffrequest" className="link">
                <MenuItem
                  component="div"
                  button
                  selected={selectedIndex === MENU_TIME_OFF_REQUEST}
                >
                  <ListItem>
                    <ListItemIcon>
                      <FlightOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Time Off Request" />
                  </ListItem>
                </MenuItem>
              </Link>
            )}
            <Link to="/employees" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_EMPLOYEES}
              >
                <ListItem>
                  <ListItemIcon>
                    <SupervisedUserCircleOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Employees" />
                </ListItem>
              </MenuItem>
            </Link>
            {/* <Link to="/meetings" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_MEETINGS}
              >
                <ListItem>
                  <ListItemIcon>
                    <MeetingRoomOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Meetings" />
                </ListItem>
              </MenuItem>
            </Link> */}
            {/* <Link to="/timetracker" className="link">
                            <MenuItem component="div" button
                                selected={selectedIndex === MENU_TIME_TRACKER}>
                                <ListItem>
                                    <ListItemIcon>
                                        <ComputerOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary="Time Tracker" />
                                </ListItem>
                            </MenuItem>
                        </Link> */}
            <Link to="/albums" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_ALBUMS}
              >
                <ListItem>
                  <ListItemIcon>
                    <PhotoLibraryOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Albums" />
                </ListItem>
              </MenuItem>
            </Link>
            {/* <Link to="/eom" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_EOM}
              >
                <ListItem>
                  <ListItemIcon>
                    <HowToVoteOutlined />
                  </ListItemIcon>
                  <ListItemText primary="EOM" />
                </ListItem>
              </MenuItem>
            </Link> */}
            <Link to="/holidays" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_HOLIDAYS}
              >
                <ListItem>
                  <ListItemIcon>
                    <BeachAccessOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Holidays" />
                </ListItem>
              </MenuItem>
            </Link>
            <Link to="/settings" className="link">
              <MenuItem
                component="div"
                button
                selected={selectedIndex === MENU_SETTINGS}
              >
                <ListItem>
                  <ListItemIcon>
                    <SettingsOutlined />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </MenuItem>
            </Link>
          </List>
        </Drawer>

        <Dialog
          fullWidth={true}
          maxWidth={"xs"}
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
        >
          <DialogTitle>Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant={"body1"}>
                Are you serious right there?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose}>Not now</Button>
            <Button color="secondary" onClick={this.handleLogout}>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    selectedMenu: state.drw.selectedMenu,
    employee: state.usr.employee,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAppData: () => dispatch(clearAppData()),
    showProgress: () => dispatch(showProgressDialog()),
    hideProgress: () => dispatch(hideProgressDialog()),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(MenuAppBar)
);
