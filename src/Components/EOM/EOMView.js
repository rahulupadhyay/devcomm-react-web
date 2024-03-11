import { Avatar, ListItem } from "@material-ui/core/es";
import { ListItemAvatar, ListItemText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";

import { ContactService } from "../../data/services";

const styles = {
  card: {
    display: "flex",
    raised: true
  },

  details: {
    display: "flex",
    flexDirection: "column",
    padding: "16px"
  },
  header: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  content: {
    flex: "1 0 auto"
  }
};

const EOMView = props => {
  const { classes } = props;

  const [electedBy, setElectedBy] = useState({});
  const [nominee, setNominee] = useState({});

  useEffect(() => {
    ContactService.getContact(props.data.elected_by).then(response => {
      setElectedBy(response.values);
    })

    ContactService.getContact(props.data.nominee)
      .then(response => {
        setNominee(response.values);
      })

  }, {});

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardContent>
          <div style={{ textAlign: "center" }}>
            <img
              style={{
                borderRadius: "50%",
                width: "96px",
                height: "96px"
              }}
              src={props.data.nominee_image}
              alt={props.data.nominee}
            />
            <Typography variant="body1">{props.data.nominee_name}</Typography>
            <Typography variant="body2">{nominee.department}</Typography>
          </div>
          <div>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  style={{
                    marginTop: "8px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%"
                  }}
                  src={electedBy.Image}
                  alt={electedBy.first_name}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography style={{ fontWeight: "bold" }} variant="body1">
                    {electedBy.first_name + " " + electedBy.last_name + ":"}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2">{props.data.comments}</Typography>
                }
              />
            </ListItem>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

EOMView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EOMView);
