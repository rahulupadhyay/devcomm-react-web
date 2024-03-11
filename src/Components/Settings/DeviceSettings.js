import { connect } from "react-redux";
import { Divider, List, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DeviceInfoItem } from './settingsItem';
import { DeviceInfoService } from '../../data/services';
import { showSnackbar } from '../../Store/actions';
import { variant } from '../common/SnackBar';
import CircularLoader from "../common/CircularLoader";

const useStyles = makeStyles(themes => ({
    paper: {
        padding: 8,
        minHeight: 150

    },
    content: {
        margin: 8
    }

}))

const DeviceSettings = (props) => {
    const [devices, setDevices] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        DeviceInfoService.getUserDevices()
            .then((response) => {
                setLoading(false);
                if (response.status === 1) {
                    let signedInDevices = response.values.filter((device, _index, array) => {
                        // it means user is currently logged in to this device
                        return device.is_deleted === '0';
                    })
                    setDevices(signedInDevices);
                }
            })

    }, [])

    const handleSingOutFromDevice = (index, deviceId) => {
        if (window.confirm('This will remove access to your DevComm account from the device')) {
            DeviceInfoService.signOutFromDevice(deviceId)
                .then((response) => {
                    props.openSnackbar(response.status === 1 ? variant.success : variant.failure, response.message);
                    if (response.status === 1) {
                        // console.debug('index', index);
                        devices.splice(index, 1);
                        // console.debug('spliced _devices', devices.length);
                        setDevices([...devices]);
                    }
                })
        }
    }

    const classes = useStyles();
    // console.debug(devices[0]);
    return (
        <Paper className={classes.paper}>
            <Typography variant="h4" style={{ textAlign: 'center' }} gutterBottom>
                Your devices
                </Typography>
            <Divider variant={'middle'} />
            <Typography variant="h5" gutterBottom className={classes.content}>
                {devices.length + ' signed-in devices'}
            </Typography>

            {isLoading ? <CircularLoader /> : <List>{
                devices.sort((a, b) => moment(b.last_access_time) - moment(a.last_access_time))
                    .map((device, index) => {
                        return <DeviceInfoItem key={device.user_device_info_id} device={device}
                            onSignOut={e => handleSingOutFromDevice(index, device.user_device_info_id)} />
                    })
            }
            </List>}
        </Paper>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: (variant, message) =>
            dispatch(showSnackbar({ open: true, variant: variant, message: message }))
    };
};

export default connect(
    null,
    mapDispatchToProps
)(DeviceSettings);