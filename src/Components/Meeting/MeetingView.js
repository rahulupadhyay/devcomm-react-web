import {
  Avatar,
  Grid,
  Link as HyperLink,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  DeleteOutlined,
  EditOutlined,
  FileCopyOutlined,
  LinkOutlined,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core/es";
import { Link } from "react-router-dom";
import moment from "moment";
import React, { useState } from "react";

import "./meeting.css";

const MeetingView = (props) => {
  // console.debug(props.meeting);
  const meeting = props.meeting;
  const agenda = props.agenda;
  const mMemberSize = meeting.members.length;

  const membersLimit = 5;
  const remainingMembers = mMemberSize - membersLimit;
  const [anchor, setAnchor] = useState(null);

  const utcStartTime = moment.utc(meeting.start_time).toDate();
  // const locatStartTime = moment(utcStartTime).format('YYYY-MM-DD HH:mm:ss');

  const handleTaskClick = (taskName) => {
    // alert(taskName);
    window.open("https://devtracker.devdigital.com/track/" + taskName);
  };

  console.log("meetings", meeting);

  return (
    <div className="meetingView" onClick={props.onClick}>
      <div>
        <div style={{ display: "flex" }}>
          {agenda ? (
            <div>
              <Typography color="textSecondary" variant={"caption"}>
                <b>
                  {moment.utc(utcStartTime).local().format("dddd MMM Do YYYY") +
                    " | "}
                </b>
                {moment(utcStartTime).format("hh:mm A") +
                  " - " +
                  moment(utcStartTime)
                    .add(meeting.duration, "hours")
                    .format("hh:mm A")}{" "}
                <br></br>
              </Typography>
            </div>
          ) : (
            <div>
              <Typography color="textSecondary" variant={"body2"}>
                {moment(utcStartTime).format("hh:mm A") +
                  " - " +
                  moment(utcStartTime)
                    .add(meeting.duration, "hours")
                    .format("hh:mm A")}{" "}
                <br></br>
              </Typography>
              <Typography color="textSecondary" variant={"caption"}>
                {moment(utcStartTime, "YYYY-MM-DD HH:mm:ss").fromNow() + " | "}
                {meeting.location}
              </Typography>
            </div>
          )}

          {/* <Tooltip title='Options'>
                    <IconButton style={{ alignItems: 'right' }} onClick={(event) => {
                        event.stopPropagation();
                        setAnchor(event.currentTarget)
                    }}>
                        <MoreHorizOutlined />
                    </IconButton>
                </Tooltip> */}

          <Menu
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={(e) => {
              e.stopPropagation();
              setAnchor(null);
            }}
          >
            <MenuItem onClick={() => alert("edit")}>
              <EditOutlined style={{ marginRight: "16px" }} />
              Edit
            </MenuItem>

            <MenuItem onClick={() => alert("Copy")}>
              <FileCopyOutlined style={{ marginRight: "16px" }} />
              Copy
            </MenuItem>
            <MenuItem onClick={() => alert("Delete")}>
              <DeleteOutlined style={{ marginRight: "16px" }} />
              Delete
            </MenuItem>
          </Menu>
        </div>

        <Typography
          style={{ fontWeight: "bold", paddingTop: "8px" }}
          variant={"body1"}
        >
          {meeting.agenda}
        </Typography>

        <Typography style={{ marginTop: "8px" }} variant={"body2"}>
          {meeting.purpose}
        </Typography>

        <div
          style={{ display: "flex", marginTop: "12px", alignItems: "center" }}
        >
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
          >
            {meeting.members
              .filter((i, index) => index < membersLimit)
              .map((member, index) => {
                return (
                  <Grid key={member.member_id} item>
                    {index === membersLimit - 1 ? (
                      <Avatar
                        style={{
                          boxShadow: "1px 1px 2px black",
                          margin: "-5px",
                        }}
                      >
                        <Typography variant={"caption"}>
                          {"+" + (remainingMembers + 1)}
                        </Typography>
                      </Avatar>
                    ) : (
                      <Link to={`/employees/${member.member_id}`}>
                        <Tooltip title={member.member_name}>
                          <Avatar
                            style={{
                              boxShadow: "1px 1px 2px black",
                              margin: "-5px",
                            }}
                            src={member.member_image}
                          />
                        </Tooltip>
                      </Link>
                    )}
                  </Grid>
                );
              })}
          </Grid>
          {meeting.project_id !== "0" && (
            <Tooltip
              title={
                <div>
                  <Typography variant="body2" color="inherit">
                    Project Details
                  </Typography>
                  <Typography variant="caption" color="inherit">
                    {meeting.project_name}
                  </Typography>
                  <Typography variant="caption" color="inherit">
                    {meeting.task_name}
                  </Typography>
                </div>
              }
            >
              <IconButton
                color="primary"
                onClick={() => handleTaskClick(meeting.task_name.split("(")[0])}
              >
                <LinkOutlined />
              </IconButton>
            </Tooltip>
          )}
          <Typography variant={"caption"}>
            {
              meeting.members.filter((val, ind, arr) => {
                return val.status === "YES";
              }).length
            }
            {" Joined"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MeetingView;
