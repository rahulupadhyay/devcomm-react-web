import React, { useRef } from "react";
import { connect } from "react-redux";
import {
  withStyles,
  Grid,
  IconButton,
  Typography,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  ButtonBase,
  Select,
  InputLabel,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
} from "@material-ui/core";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import ArrowIcon from "@material-ui/icons/ArrowForward";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";

import SkeletonLoading from "../Loaders/SkeletonLoading";
import StyledRadio from "../common/StyledRadio";

import { showSnackbar } from "../../Store/actions";
import { TimeTrackerService } from "../../data/services";
import { colors } from "../../common/colors";
import {
  getDay,
  getMonthAndDate,
  getYear,
  formatDate,
  YYYY_MM_DD,
  getCurrentDate,
} from "../../common/MomentUtils";
import { ProgressDialog } from "../Dialogs";
import UploadMedia from "./UploadMedia";
import { find } from "lodash";
import { base64StringtoFile } from "../../common";

const strings = {
  title: "Time Off Apply",
  leave_type: "Leave Type",
  casual_leave: "Casual Leave",
  sick_leave: "Sick Leave",
  full_day: "Full Day",
  half_day: "Half Day",
  from_date: "From Date",
  to_date: "To Date",
  req_time_off_hours: "Requested Time Off Hours",
  description: "Description",
  enter_time_off_details: "Please enter time off details",
  select_tl: "Please select TL/HOD",
  attachment: "Attachment",
  add_attachment: "Add Attachment",
  select_tl_hold: "Select TL / HOD",
  submit_request: "Submit Request",
};

class TimeOffApply extends React.Component {
  state = {
    isLoading: false,
    isFetching: false,
    managers: [],
    selectedLeaveType: "casual",
    selectedDayType: "full",
    selectedManager: "",
    timeOffHours: "9.0",
    startDate: getCurrentDate(),
    endDate: getCurrentDate(),
    showFromDatePicker: false,
    showToDatePicker: false,
    description: "",
    hoursEnable: true,
    openMediaDialog: false,
    selectedFile: "",
    rawFile: "",
    showDescError: false,
    showManagerError: false,
  };

  componentDidMount() {
    this._fetchMyManagers();
  }

  _goToBack = () => {
    this.props.history.goBack();
  };

  _fetchMyManagers = () => {
    TimeTrackerService.getManagers().then((response) => {
      this.setState({ isLoading: false, managers: response.values });
    });
  };

  _fetchTimeOffHours = () => {
    const { startDate, endDate } = this.state;
    this.setState({ isFetching: true });
    TimeTrackerService.getTimeOffHours(startDate, endDate).then((response) => {
      var hours = parseFloat(response.values.timeoff_hours).toFixed(1);
      this.setState({
        isFetching: false,
        timeOffHours: hours,
        selectedDayType: "full",
      });
    });
  };

  _submitTimeOffHours = () => {
    const {
      selectedLeaveType,
      selectedDayType,
      selectedManager,
      managers,
      rawFile,
      selectedFile,
    } = this.state;

    if (!this._validateData()) return;

    var manager = find(managers, (m) => m.user_name === selectedManager);

    var param = new FormData();
    param.append("user_id", this.props.employee.employee_id);
    param.append("start_date", this.state.startDate);
    param.append("end_date", this.state.endDate);
    param.append("hours", this.state.timeOffHours);
    param.append("full_day", selectedDayType === "full" ? true : false);
    param.append("tl_hod", manager ? manager.user_id : "");
    param.append("details", this.state.description);
    param.append("leave_type", selectedLeaveType === "sick" ? "SL" : "CL");

    if (rawFile.length > 0) {
      const file = base64StringtoFile(rawFile, selectedFile);
      param.append("document_file", file);
    }

    this.setState({ isFetching: true });
    TimeTrackerService.submitTimeOff(param).then((response) => {
      this.setState({ isFetching: false });
      this.props.openSnackbar(response.message);
      if (response.status === 1) {
        this._goToBack();
      }
    });
  };

  _validateData = () => {
    const { description, managers, selectedManager } = this.state;
    var showDescError = false;
    var showManagerError = false;

    if (description.length === 0) showDescError = true;

    if (managers.length > 0 && selectedManager.length === 0)
      showManagerError = true;

    var isValid = false;

    if (!showDescError && !showManagerError) isValid = true;

    this.setState({ showDescError, showManagerError });

    return isValid;
  };

  _onLeaveTypeRadioChange = (event) => {
    this.setState({ selectedLeaveType: event.target.value });
  };

  _onDayTypeRadioChange = (event) => {
    var hours = this.state.timeOffHours;
    if (event.target.value === "full") hours = "9.0";
    else hours = "4.5";
    this.setState({ selectedDayType: event.target.value, timeOffHours: hours });
  };

  _onStartDateChange = (date) => {
    var startDate = formatDate(date, YYYY_MM_DD);
    var endDate = this.state.endDate;
    var isBefore = moment(endDate).isBefore(startDate);
    if (isBefore) {
      this.setState(
        { startDate, endDate: startDate, hoursEnable: true },
        this._fetchTimeOffHours
      );
    } else {
      var hoursEnable = startDate === endDate;
      this.setState({ startDate, hoursEnable }, this._fetchTimeOffHours);
    }
  };

  _onEndDateChange = (date) => {
    var startDate = this.state.startDate;
    var endDate = formatDate(date, YYYY_MM_DD);
    var hoursEnable = startDate === endDate;
    this.setState({ endDate, hoursEnable }, this._fetchTimeOffHours);
  };

  _onDescriptionTextChange = (event) => {
    this.setState({ description: event.target.value });
  };

  _handleManagerChange = (event) => {
    this.setState({ selectedManager: event.target.value });
  };

  _openMediaDialog = () => {
    this.setState({ openMediaDialog: true });
  };

  _dismissMediaDialog = () => {
    this.setState({ openMediaDialog: false });
  };

  _handleMediaResponse = (name, file) => {
    this.setState({
      openMediaDialog: false,
      selectedFile: name,
      rawFile: file,
    });
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
        {strings.title}
      </Typography>
    </Grid>
  );

  renderContainer = () => {
    return (
      <Paper style={{ margin: "8px", padding: 12 }}>
        <Grid container>
          {this.renderLeaveType()}
          {this.renderFromToDate()}
          {this.renderDescription()}
          {this.renderSelectManagers()}
          {this.renderAttachment()}
          {this.renderSubmitRequest()}
        </Grid>
      </Paper>
    );
  };

  renderLeaveType = () => {
    const { selectedLeaveType, selectedDayType, hoursEnable } = this.state;
    const { classes } = this.props;
    return (
      <>
        <Typography variant={"h5"}>{strings.leave_type}</Typography>
        <Grid container>
          <RadioGroup
            defaultValue={selectedLeaveType}
            onChange={this._onLeaveTypeRadioChange}
            style={{ flexDirection: "row", flex: 1 }}
          >
            <FormControlLabel
              value="casual"
              control={<StyledRadio />}
              label={
                <Typography variant={"h6"}>{strings.casual_leave}</Typography>
              }
              className={
                selectedLeaveType === "casual"
                  ? classes.selectedRadio
                  : classes.unSelectedRadio
              }
            />

            <FormControlLabel
              value="sick"
              control={<StyledRadio />}
              label={
                <Typography variant={"h6"}>{strings.sick_leave}</Typography>
              }
              className={
                selectedLeaveType === "sick"
                  ? classes.selectedRadio
                  : classes.unSelectedRadio
              }
            />
          </RadioGroup>
        </Grid>
        <Grid container>
          <RadioGroup
            defaultValue={selectedDayType}
            onChange={this._onDayTypeRadioChange}
            style={{ flexDirection: "row", flex: 1 }}
          >
            <FormControlLabel
              disabled={!hoursEnable}
              value="full"
              control={<StyledRadio />}
              label={<Typography variant={"h6"}>{strings.full_day}</Typography>}
              className={
                selectedDayType === "full"
                  ? classes.selectedRadio
                  : classes.unSelectedRadio
              }
            />

            <FormControlLabel
              disabled={!hoursEnable}
              value="half"
              control={<StyledRadio />}
              label={<Typography variant={"h6"}>{strings.half_day}</Typography>}
              className={
                selectedDayType === "half"
                  ? classes.selectedRadio
                  : classes.unSelectedRadio
              }
            />
          </RadioGroup>
        </Grid>
      </>
    );
  };

  renderFromToDate = () => {
    const { startDate, endDate } = this.state;
    return (
      <>
        <Grid item style={{ marginTop: 24, padding: 12 }}>
          <KeyboardDatePicker
            autoOk
            disablePast
            variant="inline"
            inputVariant="outlined"
            label={strings.from_date}
            format={"dd/MM/yyyy"}
            value={startDate}
            InputAdornmentProps={{ position: "start" }}
            onChange={this._onStartDateChange}
          />
        </Grid>

        <Grid style={{ margin: 24, marginTop: 48, alignSelf: "center" }}>
          <ArrowIcon />
        </Grid>

        <Grid item style={{ marginTop: 24, padding: 12 }}>
          <KeyboardDatePicker
            autoOk
            disablePast
            variant="inline"
            inputVariant="outlined"
            label={strings.to_date}
            minDate={startDate}
            format={"dd/MM/yyyy"}
            value={endDate}
            InputAdornmentProps={{ position: "start" }}
            onChange={this._onEndDateChange}
          />
        </Grid>
        {this.renderRequestedHours()}
      </>
    );
  };

  renderRequestedHours = () => {
    return (
      <Grid
        item
        style={{
          marginTop: 24,
          flex: 1,
          alignSelf: "center",
          textAlign: "center",
        }}
      >
        <Typography display={"initial"} variant={"h6"}>
          {strings.req_time_off_hours}
        </Typography>
        <Typography display={"initial"} gutterBottom variant={"h5"}>
          {this.state.timeOffHours}
        </Typography>
      </Grid>
    );
  };

  renderDescription = () => {
    const { showDescError } = this.state;
    return (
      <Grid item xs={12} style={{ padding: 12, marginTop: 24 }}>
        <TextField
          error={showDescError}
          helperText={showDescError ? strings.enter_time_off_details : ""}
          label={strings.description}
          multiline
          onChange={this._onDescriptionTextChange}
          rows={4}
          variant="outlined"
          style={{ width: "100%" }}
        />
      </Grid>
    );
  };

  renderSelectManagers = () => {
    const { managers, showManagerError } = this.state;
    return (
      <>
        {managers && managers.length > 0 && (
          <Grid item xs={6} style={{ padding: 12, marginTop: 12 }}>
            <InputLabel>{strings.select_tl_hold}</InputLabel>
            <Select
              error={showManagerError}
              value={this.state.selectedManager}
              onChange={this._handleManagerChange}
              style={{ width: "100%" }}
            >
              {managers.map((m) => (
                <MenuItem key={m.user_id} value={m.user_name}>
                  {m.user_name}
                </MenuItem>
              ))}
            </Select>

            {showManagerError && (
              <FormHelperText style={{ marginLeft: 12, color: colors.red_500 }}>
                {strings.select_tl}
              </FormHelperText>
            )}
          </Grid>
        )}
      </>
    );
  };

  renderAttachment = () => {
    return (
      <Grid item xs={6} style={{ padding: 12, marginTop: 12 }}>
        {this.state.selectedLeaveType === "sick" && (
          <ButtonBase style={{ padding: 12 }} onClick={this._openMediaDialog}>
            <Typography display="inline" variant={"h6"}>
              {strings.add_attachment}
            </Typography>
            <AddIcon style={{ marginLeft: 8 }} />
            <Typography
              display="inline"
              style={{ marginLeft: 12 }}
              variant={"body1"}
            >
              {this.state.selectedFile}
            </Typography>
          </ButtonBase>
        )}
      </Grid>
    );
  };

  renderSubmitRequest = () => {
    const { classes } = this.props;
    return (
      <div style={{ flex: 1, marginTop: 12, padding: 12, textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.submitButton}
          onClick={this._submitTimeOffHours}
        >
          <CheckIcon fontSize="small" style={{ marginRight: 8 }} />
          {strings.submit_request}
        </Button>
      </div>
    );
  };

  renderDialog = () => {
    return (
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={this.state.openMediaDialog}
        onClose={this._dismissMediaDialog}
        aria-labelledby="change-profile-image"
      >
        <DialogTitle id="change-profile-image">
          {strings.add_attachment}
        </DialogTitle>
        <DialogContent>
          <UploadMedia
            selectedFile={this.state.selectedFile}
            handleResponse={this._handleMediaResponse}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this._dismissMediaDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    return this.state.isLoading ? (
      <SkeletonLoading />
    ) : (
      <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div style={{ marginTop: "8px" }}>
            {this.renderHeader()}
            {this.renderContainer()}
          </div>
        </MuiPickersUtilsProvider>
        {this.renderDialog()}
        <ProgressDialog open={this.state.isFetching} />
      </>
    );
  }
}

const styles = (theme) => ({
  title: {
    fontWeight: "bold",
    fontSize: 32,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.grey_800,
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    alignSelf: "center",
  },
  nameContainer: {
    marginLeft: 36,
    marginRight: 36,
  },
  leaveCardContainer: {
    display: "inherit",
    flexDirection: "row",
    border: 1,
    borderColor: colors.grey_300,
    borderRadius: 8,
    borderStyle: "solid",
    paddingLeft: 36,
    margin: 8,
    alignItems: "center",
  },
  selectedRadio: {
    flex: 1,
    margin: 8,
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.light_blue_100,
    border: 1,
    borderColor: colors.light_blue_300,
    borderRadius: 12,
    borderStyle: "solid",
  },
  unSelectedRadio: {
    flex: 1,
    margin: 8,
    marginTop: 16,
    padding: 16,
    border: 1,
    borderColor: colors.light_blue_300,
    borderRadius: 12,
    borderStyle: "solid",
  },

  submitButton: {
    margin: theme.spacing(1),
    borderRadius: 24,
    color: "white",
    "&:hover": {
      cursor: "pointer",
    },
  },
});

const mapStateToProps = (state) => {
  return {
    employee: state.usr.employee,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openSnackbar: (message) =>
      dispatch(showSnackbar({ open: true, message: message })),
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(TimeOffApply)
);
