import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
  ListItem,
  Typography,
  Paper,
  Avatar,
  Chip,
  Grid,
} from "@material-ui/core";
import SickIcon from "@material-ui/icons/LocalHospital";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { colors } from "../../common/colors";
import {
  getFormattedLeaveDate,
  formatTimeOffReqDate,
} from "../../common/MomentUtils";
import { _getStatusColor } from "../TimeOff/FilterUtils";

const strings = {
  hours: "Hour(s)",
  days: "Day(s)",
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "8px",
  },
  hoursAvatar: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  middleContainer: {
    marginLeft: theme.spacing(3),
    flex: 1,
  },
  endContainer: {
    display: "flex",
    flexDirection: "column",
  },
  smallIcon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
}));

const LeaveCard = ({ data, goToDetails }) => {
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
    <Paper className={classes.paper}>
      <ListItem button onClick={() => goToDetails(data)}>
        <div>
          <Avatar className={classes.hoursAvatar} src={data.avatar} />
        </div>

        <div className={classes.middleContainer}>
          <Typography variant="h6" style={{ fontWeight: "bold" }}>
            {data.user_name}
          </Typography>
          <Typography variant="h6">
            {data.user_role + " | " + data.department}
          </Typography>
          <Typography>{data.details}</Typography>
        </div>

        <div className={classes.endContainer}>
          <Typography variant="body2" display="initial">
            {formatTimeOffReqDate(data.start_date, data.hours, data.leave_day)}
          </Typography>
          <Chip
            style={{
              color: "#FFFFFF",
              backgroundColor: _getStatusColor(data.status),
              marginTop: 4,
              marginBottom: 4,
            }}
            label={data.status}
          />
          {data.leave_type !== null && data.leave_type === "SL" && (
            <div style={{ textAlign: "center" }}>
              <SickIcon className={classes.smallIcon} />
              {data.document_file !== null && data.document_file !== "" && (
                <AttachFileIcon className={classes.smallIcon} />
              )}
            </div>
          )}
        </div>
      </ListItem>
    </Paper>
  );
};

export default LeaveCard;
