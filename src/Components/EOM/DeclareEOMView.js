import { ChevronLeftSharp } from "@material-ui/icons";
import { connect } from "react-redux";
import { Fab, Paper } from "@material-ui/core/es";
import { List, ListItem } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { clearNominee, removeNominee } from "../../Store/actions/eomActions";
import { EOMService } from "../../data/services";
import { getUserId } from "../../data/storage";
import { logger } from "../../common/logger";
import { NominatedBy, NomineeBigView } from "./Nominee";
import EmptyView from "../EmptyView/EmptyView";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    textAlign: "end"
  },
  paper: {
    width: "100%",
    padding: 12
  },
  nomineeContainer: {
    width: "20%",
    textAlign: "center"
  },
  floating: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    margin: theme.spacing(1)
  }
}));

const RedButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    },
    padding: 4,
    margin: 12
  }
}))(Button);

const DeclareEOMView = props => {
  const classes = useStyles();
  const [message, setMessage] = useState("Hello Team, ")
  const [eom, seteom] = useState([]);
  const [mNominees, setNominees] = useState(props.nominees);
  const [values, setValues] = React.useState({});
  const [valid, setValid] = React.useState({});

  useEffect(() => {
    // console.debug("props.nominees", props.nominees);
    setNominees(props.nominees);
  }, [props.nominees]);

  const handleBackToNominations = () => {
    props.history.push({ pathname: "/eom", state: { index: 1 } });
  };

  const handleRemove = (index, nominee) => {
    // console.log(nominee);
    if (window.confirm('This will remove ' + nominee.nominee_name + ' from the list and your comments too.')) {
      logger.debug('index>>' + index);
      mNominees.splice(index, 1);
      setNominees([...mNominees]);
      props.remNominee(mNominees, nominee);
    }

  };

  const handlePost = nominee => () => {
    let mEom = eom;
    let eomData = {};
    handleValid(nominee);
    logger.debug(nominee);
    if (values[nominee] !== undefined && values[nominee] !== "") {
      mNominees.map(nom_val => {
        if (Object.keys(nom_val)[0] === nominee) {
          eomData["nominee"] = nominee;
          eomData["comment"] = values[nominee];
          let nominated_by = [];
          Object.values(nom_val)[0].nominations.map(val => {
            return nominated_by.push(val.nominated_by);
          });
          eomData["nominated_by"] = nominated_by;
        }
        return true;
      });
      mEom.push(eomData);
      seteom(mEom);
    }
  };

  const handleRollout = () => {
    if (eom.length > 0) {
      let mDaysDiff = moment().diff(moment().endOf('month'), 'days');
      let confirmRollout = true;
      if (mDaysDiff < 0) {
        confirmRollout = window.confirm('We still have hope for ' + (mDaysDiff * -1) + ' day(s). Do you still want to declare the result?');
      }

      if (!confirmRollout) {
        return;
      }
      let addEom = {};
      addEom["nomination_month"] = moment(
        props.location.state.slelectedMonthYear
      ).format("YYYY_MM");
      addEom["elected_by"] = getUserId();
      addEom["eom"] = eom;
      window.alert("This " + eom);
      // EOMService.addEOM(addEom).then(response => {
      //   // console.log(response);
      //   props.clearAll();
      //   props.history.push({ pathname: "/eom", state: { index: 0 } });
      // });
    } else {
      alert('Congratulations! You have rolled out NOTHING!')
    }
  };

  const handleChange = nominee => event => {
    setValues({ ...values, [nominee]: event.target.value });
  };

  const handleValid = nominee => {
    // console.log(nominee, values[nominee] !== undefined);
    let validValue = values[nominee] === undefined || values[nominee] === "";
    setValid({ ...valid, [nominee]: validValue });
  };

  return (
    <List className={classes.root}>
      <ListItem onClick={() => handleBackToNominations()}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", cursor: "pointer" }}>
            <ChevronLeftSharp />
            <Typography variant="body1">Back to nominations</Typography>
          </div>
          <div>
            <Typography variant="body1">
              {'For: ' + moment(props.location.state.slelectedMonthYear).format("MMMM YYYY")}
            </Typography>
          </div>
        </div>
      </ListItem>
      {mNominees.length === 0 ? <EmptyView title="No nominees selected"
        message="It seems like you have refreshed the page, please start over with the same procedure by clicking 'Back to nominations'." />
        : mNominees.map((nominee, index) => {
          return Object.values(nominee).map(nom_value => {
            return (
              <div>

                <TextField label={'Message'} fullWidth={true}
                  required={true}
                  style={{ marginTop: '8px' }}
                  value={{ message }}
                  rows='3'
                  multiline={true}
                  name={'message'}
                  // onChange={this.handleInputChange}
                  // defaultValue={meeting.purpose}
                  rowsMax='5'
                  variant='outlined'
                />

                <ListItem>
                  <Paper className={classes.paper}>
                    <div style={{ display: "flex" }}>
                      <div className={classes.nomineeContainer}>

                        <NomineeBigView user={nom_value} />

                        <RedButton
                          variant="contained"
                          color="primary"
                          onClick={(event) => handleRemove(index, nom_value)}
                        >
                          Remove
                    </RedButton>
                      </div>
                      <div style={{ width: "100%", marginLeft: "8px" }}>
                        <div style={{ position: "relative" }}>
                          <TextField
                            fullWidth
                            label="Comment"
                            multiline
                            rows="4"
                            rowsMax="4"
                            required={true}
                            onChange={handleChange(nom_value.nominee)}
                            className={classes.textField}
                            variant="outlined"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handlePost(nom_value.nominee)}
                                  >
                                    Save
                              </Button>
                                </InputAdornment>
                              )
                            }}
                            error={valid[nom_value.nominee]}
                          />
                        </div>
                        {nom_value.nominations.map((val, ind) => {
                          return <NominatedBy key={ind} user={val} />
                        })}
                      </div>
                    </div>
                  </Paper>
                </ListItem>
              </div>
            );
          });
        })}
      {mNominees.length > 0 &&
        <Fab
          onClick={() => handleRollout()}
          variant="extended"
          color="secondary"
          aria-label="Review"
          className={classes.floating}
        >
          Rollout
      </Fab>
      }
    </List>
  );
};

const mapStateToProps = state => {
  return {
    nominees: state.eom.nominees
  };
};

const mapDispatchToProps = dispatch => {
  return {
    remNominee: (nominees, nominee) =>
      dispatch(removeNominee(nominees, nominee)),
    clearAll: () => dispatch(clearNominee())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeclareEOMView);
