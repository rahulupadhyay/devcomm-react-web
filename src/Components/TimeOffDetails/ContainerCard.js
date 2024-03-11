import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Paper,
  Avatar,
  Chip,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import ArrowIcon from "@material-ui/icons/ArrowForward";
import SickIcon from "@material-ui/icons/LocalHospital";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CancelIcon from "@material-ui/icons/Cancel";
import { colors } from "../../common/colors";
import {
  getDay,
  getMonthAndDate,
  getYear,
  formatDate,
  MMMM_D_YYYY,
} from "../../common/MomentUtils";
import { _getStatusColor } from "../TimeOff/FilterUtils";
import CircularLoader from "../common/CircularLoader";
const strings = {
  sick_leave: "Sick Leave",
  casual_leave: "Casual Leave",
  hours: "Hour(s) Requested",
  days: "Day(s) Requested",
  cancel_request: "Cancel Request",
  work_flow: "Status Workflow",
};

const ContainerCard = ({
  isLoading,
  data,
  workflowList,
  hasCancelAccess,
  onCancelTimeOff,
  openAttach,
}) => {
  const classes = useStyles();

  var timeOffHours;
  var timeOffValue;
  if (parseFloat(data.hours) >= 9.0) {
    timeOffHours = data.leave_day;
    timeOffValue = strings.days;
  } else {
    timeOffHours = data.hours;
    timeOffValue = strings.hours;
  }

  return (
    <Grid container>
      <Grid item xs={9}>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={3}>
              <Typography display="inline" className={classes.title}>
                {data.leave_type === "SL"
                  ? strings.sick_leave
                  : strings.casual_leave}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {data.leave_type === "SL" && (
                <IconButton disabled={true} style={{ color: "black" }}>
                  <SickIcon />
                </IconButton>
              )}
              {data.documentFile !== null && data.documentFile !== "" && (
                <IconButton color="inherit" onClick={openAttach}>
                  <AttachFileIcon />
                </IconButton>
              )}
            </Grid>
            <Grid item align={"right"} xs={3}>
              <Chip
                style={{
                  color: "#FFFFFF",
                  marginTop: 4,
                  backgroundColor: _getStatusColor(data.status),
                }}
                label={data.status}
              />
            </Grid>

            <Grid
              item
              style={{
                border: 1,
                borderColor: colors.grey_300,
                borderRadius: 16,
                borderStyle: "solid",
                padding: 12,
                marginTop: 24,
              }}
            >
              <Typography variant={"subtitle2"}>
                {getDay(data.start_date)}
              </Typography>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 8,
                }}
              >
                <Typography
                  gutterBottom
                  style={{ fontWeight: "bold" }}
                  variant={"h4"}
                >
                  {getMonthAndDate(data.start_date)}
                </Typography>
                <Typography
                  style={{ marginLeft: 24, marginBottom: 2 }}
                  variant={"subtitle2"}
                >
                  {getYear(data.start_date)}
                </Typography>
              </Grid>
            </Grid>

            <Grid style={{ margin: 24, marginTop: 48, alignSelf: "center" }}>
              <ArrowIcon />
            </Grid>

            <Grid
              item
              style={{
                border: 1,
                borderColor: colors.grey_300,
                borderRadius: 16,
                borderStyle: "solid",
                padding: 12,
                marginTop: 24,
              }}
            >
              <Typography variant={"subtitle2"}>
                {getDay(data.end_date)}
              </Typography>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 8,
                }}
              >
                <Typography
                  gutterBottom
                  style={{ fontWeight: "bold" }}
                  variant={"h4"}
                >
                  {getMonthAndDate(data.end_date)}
                </Typography>
                <Typography
                  style={{ marginLeft: 24, marginBottom: 2 }}
                  variant={"subtitle2"}
                >
                  {getYear(data.end_date)}
                </Typography>
              </Grid>
            </Grid>

            <Grid
              style={{
                flex: 1,
                alignSelf: "center",
                textAlign: "center",
                marginTop: 32,
                // backgroundColor: colors.indigo_200,
              }}
            >
              <Typography display={"initial"} variant={"h6"}>
                {isLoading?<CircularLoader/>: timeOffHours + " " + timeOffValue}
              </Typography>

              {hasCancelAccess && (
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={onCancelTimeOff}
                >
                  <CancelIcon fontSize="small" style={{ marginRight: 8 }} />
                  {strings.cancel_request}
                </Button>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                border: 1,
                borderColor: colors.grey_300,
                borderRadius: 16,
                borderStyle: "solid",
                padding: 12,
                marginTop: 24,
                backgroundColor: colors.grey_200,
              }}
            >
              <Typography>{isLoading?<CircularLoader/>:data.details}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={3}>
        <Paper className={classes.paper}>
          <Typography style={{ marginBottom: 16 }} variant={"h5"}>
            {strings.work_flow}
          </Typography>
          {isLoading?<CircularLoader/> : workflowList.map((wf, index) => (
            <Grid key={index} container style={{ marginTop: 16 }}>
              <Grid item xs={3}>
                <Avatar src={wf.user_image} className={classes.smallAvatar} />
              </Grid>
              <Grid item xs={9}>
                <Typography display={"initial"} variant={"h6"}>
                  {wf.status === "Pending"
                    ? wf.status + " Since"
                    : wf.status + " On"}
                </Typography>
                <Typography display={"initial"} variant={"body1"}>
                  {formatDate(wf.created_on, MMMM_D_YYYY)}
                </Typography>
                <Typography display={"initial"} variant={"subtitle1"}>
                  {wf.user_name}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "9px",
    padding: "16px",
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
  },
  smallAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginTop: 4,
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: 24,
    color: "white",
    backgroundColor: colors.red_500,
    "&:hover": {
      backgroundColor: colors.red_300,
      cursor: "pointer",
    },
  },
}));

export default ContainerCard;
