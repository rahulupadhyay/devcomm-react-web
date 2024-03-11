import React from 'react';

import Lottie from 'lottie-react-web'
import no_notifications from './no_notifications.json'
import { Typography } from "@material-ui/core";
import '../common/common.css'
import { makeStyles } from '@material-ui/styles';

/*Lottie: https://github.com/felippenardi/lottie-react-web*/

const useStyles = makeStyles(themes => ({
    root: {
        textAlign: 'center',
        position: 'fixed',
        width: 'inherit',
        top: '35%'
    }
}))


const NoNotification = () => {
    const classes = useStyles();
    return <div className={classes.root}>

        <Lottie
            // width={'50%'}
            options={{
                animationData: no_notifications
            }}
        />
        <p />
        <Typography variant={"body1"}>
            {'No notifications here!'}
        </Typography>

    </div>

};

export default NoNotification;