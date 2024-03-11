import React, { Component } from "react";
import { connect } from "react-redux";
import { EditOutlined } from "@material-ui/icons";
import { Button, IconButton } from "@material-ui/core";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import Fab from "@material-ui/core/es/Fab/Fab";
import Grid from "@material-ui/core/es/Grid/Grid";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/es/styles/withStyles";
import Card from "@material-ui/core/es/Card/Card";
import { ContactService } from "../../data/services";
import { getUserId } from "../../data/storage";
import AboutEmployee from "./AboutEmployee";
import EmployeeExpertise from "./EmployeeExpertise";
import NotFound from "../NotFound/NotFound";
import { Divider } from '@material-ui/core';
import "../../Components/common/common.css";
import { showSnackbar } from "../../Store/actions";
import CircularLoader from "../common/CircularLoader";
const styles = (theme) => ({
  root: {
    position: "relative",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

class EmployeeDetails extends Component {
  state = {
    notFound: false,
    canEdit: false,
    isLoading: true,
    selectedTab: 0,
    employee: {},
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log("componentDidUpdate");
    // console.log(prevProps);
    // console.log(this.props.match.params);
    if (prevProps.match.params !== this.props.match.params) {
      this.getData();
    }
  }

  componentDidMount() {
    // console.log("componentDidMount");
    this.getData();
  }

  setData = (emp) => {
    // console.log(emp);
    if (emp === undefined) {
      // console.log("emp is null");
      this.setState({
        notFound: true,
      });
    } else {
      this.setState({
        notFound: false,
        canEdit: emp.id === getUserId(),
        isLoading: false,
        employee: emp,
      });
    }
  };

  getData = () => {
    const {
      match: { params },
    } = this.props;
    // When we directly load the URL employees/:id then we don't have the state value so we need to call
    // the employees again and need to set it
    if (this.props.employees.length) {
      // console.log("loading from reducers");
      let employees = this.props.employees;
      // console.log(employees);
      let emp = employees.filter((employee) => employee.id === params.id);
      // console.log(emp);
      this.setData(emp[0]);
    } else {
      // console.log("blank data | API Call");
      ContactService.getContact(params.id).then((response) => {
        let emp = response.values;
        this.setData(emp);
      });
    }
  };

  _copyText = (text) => {
    navigator.clipboard.writeText(text);
    this.props.openSnackbar(text + " copied.");
  };

  _goToBack = () => {
    this.props.history.goBack();
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
        {"Employee Details"}
      </Typography>
    </Grid>
  );

  render() {
    const { classes } = this.props;
    const emp = this.state.employee;

    return this.state.notFound ? (
      <NotFound />
    ) :  (
      <div className=  {classes.root}>
        {this.renderHeader()}
        <div
          style={{
            marginLeft: "48px",
            marginRight: "48px",
            marginTop: "16px",
          }}
        >
          <Grid
            spacing={2}
            container
            direction="row"
            justify="space-evenly"
            alignItems="flex-start"
          >
            <Grid item xs={3}>
            <Card raised={true} style={{ padding: 8 }}>
            <Typography variant="h4" gutterBottom style={{marginTop: "16px", marginLeft: "8px", marginBottom: "16px"}}>
                Profile
              </Typography>
            
              
                <Grid
            spacing={4}
            container
            direction="column"
            justify="center"
            alignItems="center"
            >
              
                <Grid item>
                {this.state.isLoading ? 
                <CircularLoader/>:
    
                  <img className="bigAvatar" src={emp.Image} alt={emp.first_name}  />
                }
                </Grid>
              
              <Grid item>
                <Typography variant="h4" gutterBottom color="FAFAFA"  align="center">
                  {this.state.isLoading? "":emp.first_name + " " + emp.last_name}
                </Typography >
                <Typography align="center">
                {this.state.isLoading? "":emp.user_role + " | " + emp.department}
                </Typography >
                <Typography  variant="subtitle1" align="center">{emp.officeName}</Typography >
              </Grid>
                </Grid>
              
            <Grid item>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Grid item xs={9}>
                  <Typography variant="h4" gutterBottom style={{marginTop: "16px", marginLeft: "8px", marginBottom: "16px"}}>
                        Expertise
                  </Typography>
                  </Grid>
                  {/* l̥ */}
                </Grid>
              <Divider variant={"middle"} />
              <EmployeeExpertise 
                id={emp.id}
              />
            </Grid>
            </Card>
          </Grid>
            
            <Grid item xs={9}>
              <AboutEmployee
                employee={this.state.employee}
                copyText={this._copyText}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <EmployeeExpertise skills={this.state.employee.expert} />
            </Grid> */}
          </Grid>
        </div>
        {this.state.canEdit ? (
          <Fab
            variant="extended"
            color="secondary"
            aria-label="Edit"
            className={classes.fab}
            onClick={() => this.props.history.push("/updateprofile")}
          >
            <EditOutlined className={classes.extendedIcon} />
            Edit
          </Fab>
        ) : null}
      </div>
    );
  }
}

const WhiteTextTypography = withStyles({
  root: {
    color: "#FAFAFA"
  }
})(Typography);

const mapStateToProps = (state) => {
  return {
    employees: state.usr.employees,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar: (message) =>
      dispatch(showSnackbar({ open: true, message: message })),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(EmployeeDetails)
);
