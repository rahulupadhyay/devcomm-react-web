import { Avatar, Checkbox, Fab, List, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { connect } from "react-redux";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";

import { EOMService } from "../../data/services";
import { logger } from "../../common/logger";
import { NominatedBy, Nominee } from "./Nominee";
import { storeNominee } from "../../Store/actions/eomActions";
import EmptyView from "../EmptyView/EmptyView";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop:16
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  floating: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    margin: theme.spacing(1)
  },
  fabAvatar: {
    marginRight: theme.spacing(2),
    color: "#0a0a0a",
    width: 24,
    height: 24,
    backgroundColor: "#fafafa"
  },
  badgeMargin: {
    margin: theme.spacing(2)
  }
}));

// Get All Nominations
const ViewNominations = props => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [slelectedMonthYear, setMonthYear] = useState(new Date());
  const [nominations, setNominations] = useState([]);
  const [isSelectionEnable, canSelect] = useState(true);

  const handleDeclare = () => {
    props.storeNominee(selected);
  };

  const handleSelect = nominee => () => {
    let mSelected = selected;
    if (mSelected.length < 1) {
      mSelected.push({ [nominee.nominee]: nominee });
    } else {
      let needPush = true;
      mSelected.map((value, index) => {
        if (Object.keys(value)[0] === nominee.nominee) {
          needPush = false;
          mSelected.pop({ [nominee.nominee]: nominee });
        }
        return true;
      });
      if (needPush) mSelected.push({ [nominee.nominee]: nominee });
    }
    setSelected(mSelected);
    setSelectedCount(mSelected.length);
  };

  useEffect(() => {
    setSelected(props.nominees);
    setSelectedCount(props.nominees.length);
    getNominations(slelectedMonthYear);
    getEOM(slelectedMonthYear);
  }, []);

  const getNominations = mSelectedMonthYear => {
    let mDate = moment(mSelectedMonthYear).format("YYYY_MM");
    EOMService.getAllNominations(mDate).then(response => {
      // console.log(response);
      setNominations(response.values);
      setLoading(false);
    });
  };

  const getEOM = (mSelectedMonthYear) => {
    let mDate = moment(mSelectedMonthYear).format("YYYY_MM");
    EOMService.getEOMByYear(mDate)
      .then((response) => {
        if (response.status === 1 && response.values.length > 0) {
          canSelect(false);
        }
      })
  }

  const handleDateChange = event => {
    // console.log("Selected Date:", event);
    setMonthYear(event);
    getNominations(event);
  };

  const getHeaders = () => {
    return (
      <div style={{ justifyContent: "space-between" }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            keyboard
            disableFuture
            variant="outlined"
            views={["year", "month"]}
            format="MMM yyyy"
            label="Select Month"
            onChange={handleDateChange}
            value={slelectedMonthYear}
          />

        </MuiPickersUtilsProvider>

        {!isSelectionEnable &&
          <Typography variant={'h5'} color={'error'}>
            EOM already rolled out.
          </Typography>
        }
      </div>
    );
  };

  const getCheckbox = (value) => {
    let isChecked = false;
    selected.map((sel_value, index) => {
      if (Object.keys(sel_value)[0] === value.nominee) {
        // console.debug('id matched', Object.keys(sel_value)[0], value.nominee);
        logger.debug('id matched>>' + value.nominee)
        isChecked = true;
      }
      return isChecked;
    });
    // console.debug('isSelected', isSelected)
    return <Checkbox
      disabled={!isSelectionEnable}
      checked={isChecked}
      onClick={handleSelect(value)} />
  }

  return (
    <div>
      {isLoading ? (
        <LinearProgress color="secondary" />
      ) : (
          <React.Fragment>
            {/* Header */}
            {getHeaders()}
            {/* Container */}
            {nominations.length === 0 ? <EmptyView /> :
              <Paper className={classes.container}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Select</TableCell>
                      <TableCell>Nominee</TableCell>
                      <TableCell style={{ width: '70%' }}>Nominated By</TableCell>
                    </TableRow>
                  </TableHead>


                  <TableBody>
                    {
                      nominations.sort((a, b) => b.nominations.length - a.nominations.length)
                        .map((value, index) => {
                          return (
                            <TableRow
                              key={index}
                              hover>
                              <TableCell>
                                {getCheckbox(value)}
                              </TableCell>
                              <TableCell component='th' scope='row'>
                                <Nominee user={value} />
                              </TableCell>
                              <TableCell>

                                <List dense>
                                  {value.nominations.map((nom_val, nom_ind) => {
                                    return (
                                      <NominatedBy key={nom_ind} user={nom_val} />
                                    );
                                  })}
                                </List>
                              </TableCell>
                            </TableRow>
                          );

                        })}
                  </TableBody>
                </Table>

              </Paper>

            }
            {selected.length > 0 && (
              <Link
                to={{
                  pathname: `/eom/add`,
                  state: {
                    slelectedMonthYear: slelectedMonthYear
                  }
                }}
                style={{ textDecoration: "none" }}
              >
                <Fab
                  onClick={() => handleDeclare()}
                  variant="extended"
                  color="secondary"
                  aria-label="Review"
                  className={classes.floating}
                >
                  <Avatar className={classes.fabAvatar}>{selectedCount}</Avatar>
                  Review
              </Fab>
              </Link>
            )}
          </React.Fragment>
        )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    nominees: state.eom.nominees
  };
};

const mapDispatchToProps = dispatch => {
  return {
    storeNominee: nominees => dispatch(storeNominee(nominees))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewNominations);