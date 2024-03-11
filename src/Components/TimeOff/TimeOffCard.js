import React from "react";
import { makeStyles } from "@material-ui/styles";
import { ListItem, Typography, Paper } from "@material-ui/core";
import { ListItemText } from "@material-ui/core/es";
import CircularLoader from "../common/CircularLoader";
const useStyles = makeStyles((theme) => ({
  paper: {
    minWidth: 160,
    margin: "8px",
    padding: 12,
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#fafafa",
      cursor: "pointer",
    },
  },
}));

const TimeOffCard = ({ isLoading, title, leaveInfo, color }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <ListItemText
        style={{ textAlign: "center" }}
        primary={
          <Typography style={{ color: color }} variant="h5">
            {title}
          </Typography>
        }
      />
      <ListItem style={{ justifyContent: "center" }}>
        <Typography variant="h4">{isLoading?<CircularLoader/>:leaveInfo}</Typography>
      </ListItem>
    </Paper>
  );
};

export default TimeOffCard;
