import React from "react";
import {
  Typography,
  Avatar,
  Chip,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import { filter } from "lodash";
import { colors } from "../../common/colors";

const strings = {
  filters: "Filters",
  clear: "Clear",
  showLeaves: "Show Leaves",
  upcoming: "Upcoming",
  past: "Past",
  leaveType: "Leave Type",
  fullDay: "Full Day",
  halfDay: "Half Day",
  leaveStatus: "Leave Status",
  approved: "Approved",
  cancelled: "Cancelled",
  declined: "Declined",
  pending: "Pending",
};

function FilterView(props) {
  const { selectedFilter } = props;

  const chipView = (f) => (
    <Chip
      key={f.id}
      avatar={!f.isSelected && <Avatar style={{ backgroundColor: f.color }} />}
      label={f.label}
      clickable
      onClick={() => props.addRemoveFilter(f)}
      style={{
        margin: 8,
        backgroundColor: f.isSelected ? f.color : colors.grey_200,
      }}
      onDelete={f.isSelected ? () => props.addRemoveFilter(f) : null}
      deleteIcon={<CancelIcon />}
    />
  );

  var activeFilterCount = filter(selectedFilter, (o) => o.isSelected).length;

  return (
    <Grid container>
      <Grid container>
        <Grid item xs={3} style={{ padding: 8, marginTop: 8 }}>
          {activeFilterCount > 0 && (
            <Button
              style={{ color: colors.persian_green }}
              onClick={props.clearFilter}
            >
              {strings.clear}
            </Button>
          )}
        </Grid>
        <Grid item xs={6} style={{ padding: 8, marginTop: 12 }}>
          <Typography align="center" variant={"h6"}>
            {strings.filters}
          </Typography>
        </Grid>
        <Grid item xs={3} style={{ padding: 8, textAlign: "end" }}>
          <IconButton color="inherit" onClick={props.closeFilter}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item xs={6} style={{ padding: 8 }}>
        <Typography gutterBottom variant={"h6"}>
          {strings.showLeaves}
        </Typography>
        {selectedFilter.map((l, i) => {
          if (l.id === 1 || l.id === 2) {
            return chipView(l);
          }
          return null;
        })}
      </Grid>
      <Grid item xs={6} style={{ padding: 8 }}>
        <Typography gutterBottom variant={"h6"}>
          {strings.leaveType}
        </Typography>
        {selectedFilter.map((l, i) => {
          if (l.id === 3 || l.id === 4) {
            return chipView(l);
          }
          return null;
        })}
      </Grid>
      <Grid item xs={12} style={{ padding: 8 }}>
        <Typography gutterBottom variant={"h6"}>
          {strings.leaveStatus}
        </Typography>
        {selectedFilter.map((l, i) => {
          if (l.id > 4) {
            return chipView(l);
          }
          return null;
        })}
      </Grid>
    </Grid>
  );
}

export default FilterView;
