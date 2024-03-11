import React, { useEffect, useState } from 'react';
import { Typography, ListItemText, ListItem, ListItemAvatar, Avatar } from '@material-ui/core';
import { ContactService } from '../../data/services';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(themes => ({
    bigAvatar: {
        borderRadius: "50%",
        margin: "12px",
        width: "96px",
        height: "96px"
    },
    centerDiv: {
        textAlign: "center"
    }
}))


export const Nominee = (props) => {
    const [user, setUser] = useState({});

    useEffect(
        () => {
            ContactService.getContact(props.user.nominee)
                .then((response) => {
                    setUser(response.values);
                })
        }, {})

    return <ListItem>
        <ListItemAvatar>
            <Avatar src={user.Image} alt={user.first_name} />
        </ListItemAvatar>

        <ListItemText
            primary={<Typography variant="body1">
                {props.user.nominee_name}
            </Typography>}
            secondary={
                <Typography variant="body2">{user.department}</Typography>
            }
        />
    </ListItem>
}

export const NomineeBigView = (props) => {
    // getUserDetails();
    const classes = useStyles();
    const [user, setUser] = useState({});
    useEffect(
        () => {
            ContactService.getContact(props.user.nominee)
                .then((response) => {
                    setUser(response.values);
                })
        }, {})

    return (
        <div className={classes.centerDiv}>
            <img className={classes.bigAvatar}
                style={{
                    borderRadius: "50%",
                    margin: "12px",
                    width: "96px",
                    height: "96px"
                }}
                src={user.Image}
                alt={user.first_name}
            />
            <Typography variant="body1">
                {props.user.nominee_name}
            </Typography>
            <Typography variant="body2">{user.department}</Typography>
        </div>
    )
}


export const NominatedBy = (props) => {
    const [user, setUser] = useState({});
    useEffect(
        () => {
            ContactService.getContact(props.user.nominated_by)
                .then((response) => {
                    // console.debug(response.values.Image);
                    setUser(response.values);
                })
        }, {})

    return <ListItem alignItems="flex-start" style={{padding:'0px'}}>
        <ListItemAvatar>
            <Avatar src={user.Image} alt={user.first_name} />
        </ListItemAvatar>
        <ListItemText
            primary={
                <Typography variant="body1">
                    {props.user.nominated_by_name}
                </Typography>
            }
            secondary={
                <Typography variant="body2">
                    {props.user.nominated_for}
                </Typography>
            }
        />

    </ListItem>
}