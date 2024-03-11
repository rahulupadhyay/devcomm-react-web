import { connect } from "react-redux";
import { Tab, Tabs, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import React, { Component } from "react";

import { CollaboratorService } from "../../data/services";
import { MENU_EOM } from "../common/AppBar/DCAppBar";
import { updateDrawerMenu } from "../../Store/actions";
import CurrentEOM from "./CurrentEOM";
import ViewNominations from "./ViewNominations";

/*
Employees of the Month */

const styles = theme => ({
  root: {
    position: "relative"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
});

class EOM extends Component {
  state = {
    selectedValue: 0,
    isCollaborator: false
  };

  handleTabSelection = tabPosition => {
    // console.log(tabPosition);
    this.setState({
      selectedValue: tabPosition
    });
  };

  handleTabChange = (event, value) => {
    this.setState({
      selectedValue: value
    });
  };

  componentDidMount() {
    this.props.changeDrawerMenu(MENU_EOM);
    if (this.props.location.state !== undefined) {
      this.handleTabSelection(this.props.location.state.index);
    }
    CollaboratorService.isEOMCollaborator()
      .then((response) => {
        if (response.status === 1) {
          this.setState({
            isCollaborator: response.values.is_collaborator
          })
        }
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {/* Tab bar */}
        <Typography variant={'h5'}>
          EOM
          </Typography>

        <Paper style={{ marginTop: '12px', marginBottom: '16px' }}>
          <Tabs
            value={this.state.selectedValue}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={"Employees of the Month"} />
            {this.state.isCollaborator && <Tab label={"View Nominations"} />}
          </Tabs>
        </Paper>
        {/* container */}

        {this.getSelectedView(this.state.selectedValue)}

      </div>
    );
  }

  getSelectedView = selectedValue => {
    switch (selectedValue) {
      case 1:
        return <ViewNominations />;
      default:
        return <CurrentEOM />;
    }
  };
}

const mapStateToProps = state => {
  return {
    employees: state.usr.employees
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index))
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(EOM)
);
