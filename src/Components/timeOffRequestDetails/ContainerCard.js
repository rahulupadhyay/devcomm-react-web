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
  Select,
  MenuItem,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import ArrowIcon from "@material-ui/icons/ArrowForward";
import SickIcon from "@material-ui/icons/LocalHospital";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import { colors } from "../../common/colors";
import {
  getDay,
  getMonthAndDate,
  getYear,
  formatDate,
  MMMM_D_YYYY,
  formatDateTime,
} from "../../common/MomentUtils";
import { _getStatusColor } from "../TimeOff/FilterUtils";

const strings = {
  sick_leave: "Sick Leave",
  casual_leave: "Casual Leave",
  hours: "Hour(s) Requested",
  days: "Day(s) Requested",
  cancel_request: "Cancel Request",
  work_flow: "Status Workflow",
  details: "Details",
  take_action: "Take Action",
  next_approver: "Next Approver",
  select_approver: "Please select approver",
  comment: "Comment",
  enter_comment: "Please enter comment",
  deny: "Deny",
  approve: "Approve",
};

const ContainerCard = ({
  isLoading,
  data,
  employee,
  workflowList,
  hasCancelAccess,
  onCancelTimeOff,
  openAttach,
  managers,
  selectedManager,
  showManagerError,
  handleManagerChange,
  onCommentTextChange,
  showCommentError,
  onApproveOrDenyButton,
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

  var hasApproveOrDenyAccess =
    data &&
    data.status === "Pending" &&
    data.workflow.length > 0 &&
    data.workflow[0].user_id === employee.employee_id;

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
              {data.document_file !== null && data.document_file !== "" && (
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
              }}
            >
              <Typography display={"initial"} variant={"h6"}>
                {timeOffHours + " " + timeOffValue}
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
              <Typography display={"initial"} gutterBottom variant={"h6"}>
                {strings.details}
              </Typography>
              <Typography>{data.details}</Typography>
            </Grid>

            {hasApproveOrDenyAccess && (
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
                <Typography display={"initial"} gutterBottom variant={"h6"}>
                  {strings.take_action}
                </Typography>

                <Grid container>
                  <Grid item style={{ alignSelf: "flex-end" }} xs={6}>
                    <Select
                      className={classes.managerDropDown}
                      value={selectedManager}
                      displayEmpty
                      onChange={handleManagerChange}
                    >
                      <MenuItem value="">
                        <em>{strings.next_approver}</em>
                      </MenuItem>
                      {managers.map((m) => (
                        <MenuItem key={m.user_id} value={m.user_name}>
                          {m.user_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {showManagerError && (
                      <FormHelperText style={{ color: colors.red_500 }}>
                        {strings.select_approver}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      error={showCommentError}
                      helperText={showCommentError ? strings.enter_comment : ""}
                      style={{ display: "flex", flex: 1 }}
                      label={strings.comment}
                      onChange={onCommentTextChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ textAlign: "end", marginTop: 24 }}
                  >
                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={() => onApproveOrDenyButton(false)}
                    >
                      <CancelIcon fontSize="small" style={{ marginRight: 8 }} />
                      {strings.deny}
                    </Button>

                    <Button
                      variant="contained"
                      className={classes.approveButton}
                      onClick={() => onApproveOrDenyButton(true)}
                    >
                      <CheckIcon fontSize="small" style={{ marginRight: 8 }} />
                      {strings.approve}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={3}>
        <Paper className={classes.paper}>
          <Typography style={{ marginBottom: 16 }} variant={"h5"}>
            {strings.work_flow}
          </Typography>
          {workflowList.map((wf, index) => (
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
                  {formatDateTime(wf.created_on, MMMM_D_YYYY)}
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
  managerDropDown: {
    display: "flex",
    flex: 1,
    marginRight: 24,
    paddingLeft: 4,
    backgroundColor: colors.red_100,
  },
  approveButton: {
    margin: theme.spacing(1),
    borderRadius: 24,
    color: "white",
    backgroundColor: colors.green_500,
    "&:hover": {
      backgroundColor: colors.green_300,
      cursor: "pointer",
    },
  },
}));

export default ContainerCard;
