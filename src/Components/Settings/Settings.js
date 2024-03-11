import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import NotificationSettings from './NotificationSettings';
import { MENU_SETTINGS } from '../common/AppBar/DCAppBar';
import { updateDrawerMenu } from '../../Store/actions';
import DeviceSettings from './DeviceSettings';

const useStyles = makeStyles(themes => ({
    container: {
        marginTop: 8
    }
}))

const Settings = (props) => {

    useEffect(() => {
        props.changeDrawerMenu(MENU_SETTINGS)
    }, [])

    const classes = useStyles();
    return (

        <div>
            <Typography variant={"h5"}>
                Settings
                </Typography>
            <Grid container spacing={2}
                className={classes.container}
                justify="flex-start"
                alignItems="flex-start">

                {/* Manage Devices */}
                <Grid item xs={6}>
                    <DeviceSettings />
                </Grid>

                {/* Notification settings */}
                <Grid item xs={6}>
                    <NotificationSettings />
                </Grid>
            </Grid>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index))
    };
};

export default connect(null, mapDispatchToProps)(Settings)