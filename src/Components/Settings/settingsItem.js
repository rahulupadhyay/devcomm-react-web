import { Button, Checkbox, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { LaptopWindowsOutlined, PermDeviceInformationOutlined, PhoneAndroidOutlined, PhoneIphoneOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React from 'react';

import { getUUID } from '../../data/storage/DeviceHelper';

const useStyle = makeStyles(themes => ({
    inline: {
        display: 'inline',
    }
}))

export const NotificationItem = (props) => {

    return (
        <ListItem>
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>
            <ListItemText
                primary={
                    <Typography variant='body1'>
                        {props.title}
                    </Typography>
                }
                secondary={
                    <Typography variant='body2'>
                        {props.subTitle}
                    </Typography>
                }
            />
            <ListItemSecondaryAction>
                <Checkbox disabled={props.disabled} checked />
            </ListItemSecondaryAction>
        </ListItem>
    )

}

export const DeviceInfoItem = (props) => {
    const _device = props.device;
    const _isSameDevice = _device.device_id === getUUID();
    const classes = useStyle();
    const utcStartTime = moment.utc(_device.last_access_time).toDate();
    return <ListItem>
        <ListItemIcon>
            {_device.dev_platform.match('web') ? <LaptopWindowsOutlined /> :
                _device.dev_platform.match('android') ? <PhoneAndroidOutlined /> :
                    _device.dev_platform.match('iphone') ? <PhoneIphoneOutlined /> : <PermDeviceInformationOutlined />}
        </ListItemIcon>
        <ListItemText
            primary={
                <Typography variant='body1'>
                    {_device.device_hardware
                        .charAt(0).toUpperCase()
                        + _device.device_hardware.substring(1).replace('|', '/')}
                </Typography>
            }
            secondary={
                <React.Fragment>
                    <Typography variant='body2' component="span" className={classes.inline} color={"textPrimary"}>
                        {_isSameDevice ? 'Now' :
                            moment.utc(utcStartTime).local().fromNow()
                        }
                    </Typography>
                    {_isSameDevice && ' - This device'}
                </React.Fragment>
            }
        />

        {!_isSameDevice &&
            <ListItemSecondaryAction>
                <Button onClick={props.onSignOut}>Sign out</Button>
            </ListItemSecondaryAction>}
    </ListItem>
}