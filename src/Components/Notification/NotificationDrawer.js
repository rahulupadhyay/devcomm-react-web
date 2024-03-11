import { Avatar, Drawer, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { ClearAllOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core/es';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';

import { clearAllNotifications, getNotifications } from '../../data/storage/NotificationHelper';
import NoNotification from './NoNotification';

const useStyles = makeStyles(theme => ({
    root: {
        position: "relative",
        padding: 16
    },
    notificationDrawer: {
        width: 350
    },
    drawerPadding: {
        padding: 16
    },
    floating: {
        position: "fixed",
        bottom: theme.spacing(2),
        // right: theme.spacing(2),
        left: '40%',

        margin: theme.spacing(1)
    }
}));



const NotificationDrawer = (props) => {

    const [notifications, setNotifications] = useState(getNotifications());

    const clearAll = () => {
        clearAllNotifications();
        setNotifications(null);
    }

    useEffect(() => {
        setNotifications(getNotifications());
    }, [getNotifications()])

    const classes = useStyles();
    return <Drawer
        anchor="right" open={Boolean(props.anchorNotif)}
        onClose={props.handleClose}>
        <div className={classes.root}>
            <List>
                <ListItem >
                    <ListItemText
                        primary={
                            <Typography variant={'h6'}>
                                Notifications
                        </Typography>
                        }
                    />
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => { clearAll() }}>
                            <ClearAllOutlined />
                        </IconButton>
                    </ListItemSecondaryAction>

                </ListItem>
            </List>
            <List className={classes.notificationDrawer}>

                {
                    notifications === null ? <NoNotification /> : notifications.map((notif, index) => {
                        return <ListItem button key={index}>
                            <ListItemAvatar>
                                <Avatar>{notif.title.charAt(0).toUpperCase()}</Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Typography variant={'caption'}>
                                        {notif.message}
                                    </Typography>
                                }
                            />


                        </ListItem>
                    })
                }
            </List>
        </div>
    </Drawer>
}

export default NotificationDrawer;