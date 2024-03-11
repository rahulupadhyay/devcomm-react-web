import { CakeOutlined, CardMembershipOutlined, TodayOutlined } from '@material-ui/icons';
import { Divider, List, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';

import { NotificationItem } from './settingsItem';

const useStyles = makeStyles(themes => ({
    paper: {
        padding: 8
    }
}))

const NotificationSettings = (props) => {
    const [settingsDisabled] = useState(true);
    const classes = useStyles();
    return (
        <Paper className={classes.paper}>
            <Typography variant="h4" style={{ textAlign: 'center' }} gutterBottom>
                Notifications
                </Typography>
            <Divider variant={'middle'} />

            <List>
                <NotificationItem icon={<TodayOutlined />} disabled={settingsDisabled}
                    title={'Daily Reminders'} subTitle={'Stay updated'} />
                <NotificationItem icon={<CakeOutlined />} disabled={settingsDisabled}
                    title={'Birthday Reminders'} subTitle={'Socially involved'} />
                <NotificationItem icon={<CardMembershipOutlined />} disabled={settingsDisabled}
                    title={'Anniversary Reminders'} subTitle={'Socially involved'} />

            </List>
        </Paper>
    )
}

export default NotificationSettings;