import React from "react";
import Card from "@material-ui/core/es/Card/Card";
import Typography from "@material-ui/core/es/Typography/Typography";
import Divider from "@material-ui/core/es/Divider/Divider";
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/es/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import Grid from "@material-ui/core/es/Grid/Grid";
import {
  CakeOutlined,
  EmailOutlined,
  EventOutlined,
  MessageOutlined,
  PhoneOutlined,
  PersonOutlined,
  NotInterestedOutlined,
  PersonPinOutlined,
} from "@material-ui/icons";
import CopyIcon from "@material-ui/icons/FileCopy";
import moment from "moment";
import { colors, IconButton, Tooltip } from "@material-ui/core";

class AboutEmployee extends React.Component {
  state = {
    isMobileHover: false,
    isMail1Hover: false,
    isMail2Hover: false,
  };

  _toggleHover = (fieldName) => {
    this.setState({ [fieldName]: !this.state[fieldName] });
  };

  renderCopyButton = (fieldName, text) => {
    return (
      this.state[fieldName] &&
      text.length > 0 && (
        <ListItemIcon>
          <Tooltip title="Copy">
            <IconButton
              color="inherit"
              onClick={() => this.props.copyText(text)}
            >
              <CopyIcon color="primary" />
            </IconButton>
          </Tooltip>
        </ListItemIcon>
      )
    );
  };

  render() {
    let emp = this.props.employee;
    return (
      <div style={{ border: "black", borderWidth: "medium" }}>
        <Card raised={true} style={{ padding: 8 }}>
         <Typography variant="h4" gutterBottom style={{marginTop: "16px", marginLeft: "8px"}}>
            Personal Information
          </Typography>
          <Grid
            container
            direction="row"
            justify="start"
            alignItems="center">
              <Grid item xs={6}>
              <ListItem
                button
                onMouseEnter={() => this._toggleHover("isMobileHover")}
                onMouseLeave={() => this._toggleHover("isMobileHover")}
                >
              <ListItemIcon>
                <PhoneOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    <a
                      href={`tel:${emp.phone}`}
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      {emp.phone}
                    </a>
                  </Typography>
                }
                secondary="Mobile"
              />
              {this.renderCopyButton("isMobileHover", emp.phone)}
            </ListItem>
              </Grid>
              <Grid item xs = {6}>
              <ListItem
              button
              onMouseEnter={() => this._toggleHover("isWhatsAppHover")}
              onMouseLeave={() => this._toggleHover("isWhatsAppHover")}
            >
              <ListItemIcon>
                <PhoneOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    <a
                      href={`tel:${emp.whatsapp_number}`}
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      {emp.whatsapp_number}
                    </a>
                  </Typography>
                }
                secondary="WhatsApp"
              />
              {this.renderCopyButton("isWhatsAppHover", emp.phone)}
            </ListItem>
              </Grid>

              <Grid item xs = {6}>
              <ListItem button>
              <ListItemIcon>
                <CakeOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {moment(emp.birth_date, "YYYY-MM-DD").format("MMMM Do")}
                  </Typography>
                }
                secondary="Birthday"
              />
            </ListItem>
              </Grid>

              <Grid item xs = {6}>
              <ListItem button>
              <ListItemIcon>
                <EventOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {moment(emp.hire_date, "YYYY-MM-DD").format(
                      "MMMM Do, YYYY"
                    )}
                  </Typography>
                }
                secondary="Joined DevDigital"
              />
            </ListItem>
              </Grid>
              <Grid item xs = {6}>
              <ListItem
              button
              onMouseEnter={() => this._toggleHover("isMail1Hover")}
              onMouseLeave={() => this._toggleHover("isMail1Hover")}
            >
              <ListItemIcon>
                <EmailOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    <a
                      href={`mailto:${emp.email}`}
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      {emp.email}
                    </a>
                  </Typography>
                }
                secondary="Email (Work)"
              />
              {this.renderCopyButton("isMail1Hover", emp.email)}
            </ListItem>
              </Grid>

          </Grid>
          
          <Typography variant={"h4"} style={{ padding: 8 }}>Emergency Contact Information</Typography>
          <Grid
            container
            direction="row"
            justify="start"
            alignItems="center">

            <Grid item xs={6}>
            <ListItem button>
              <ListItemIcon>
                <PersonOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {emp.emergency_name}
                  </Typography>
                }
                secondary="Name"
              />
            </ListItem>
            </Grid>
            <Grid item xs={6}>
            <ListItem button>
              <ListItemIcon>
                <PersonPinOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {emp.emergency_relation}
                  </Typography>
                }
                secondary="Relation"
              />
            </ListItem>
            </Grid>
            <Grid item xs={6}>
            <ListItem
              button
              onMouseEnter={() => this._toggleHover("isEmePhoneHover")}
              onMouseLeave={() => this._toggleHover("isEmePhoneHover")}
            >
              <ListItemIcon>
                <PhoneOutlined color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    <a
                      href={`tel:${emp.emergency_phone}`}
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      {emp.emergency_phone}
                    </a>
                  </Typography>
                }
                secondary="Phone"
              />
              {this.renderCopyButton("isEmePhoneHover", emp.emergency_phone)}
            </ListItem>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
}

export default AboutEmployee;
