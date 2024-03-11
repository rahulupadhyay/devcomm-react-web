import { Avatar, ListItemAvatar } from '@material-ui/core/es';
import { Button, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import { CardGiftcardOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { ContactService } from '../../data/services';

const useStyles = makeStyles(theme => ({
    leftIcon: {
        marginRight: theme.spacing(1)
    }
}))

/**
 * Method to send an email to the user
 * @param {object} user 
 * @param {string} agendaType 
 */
const handleClick = (user, agendaType) => {
    let subject = '';
    let body = '';

    // console.debug('agendaType', agendaType);
    if (agendaType === 'anniversary') {
        subject = 'Happy Work Anniversary';
        let mTime = moment().diff(user.hire_date, 'years');
        let mTimeWord = moment(mTime).format("Do");
        // use %0D for a line break. Don't remove it. 
        body = `Hi ${user.first_name}, %0DCongratulations on your ${mTimeWord} Work Anniversary! 🎉%0D%0D`;
    } else if (agendaType === 'birthdays') {
        subject = 'Happy Birthday';
        body = `Hi ${user.first_name}, %0DWish you many many happy returns of the day! 🎉🎂%0D%0D`;
    }

    window.open(`mailto:${user.email}?subject=${subject}&body=${body}`);
}

const CalendarItem = (props) => {
    const [user, setUser] = useState({});
    const classes = useStyles();

    const handleListItemClick = (id) => {
        if (id !== undefined) {
            props.onClick(id);
        }
    }

    useEffect(
        () => {
            if (props.agenda.id !== undefined) {
                ContactService.getContact(props.agenda.id)
                    .then((response) => {
                        // console.debug(response.values.Image);
                        setUser(response.values);
                    })
            }
        }, '')

    return <ListItem button onClick={() => handleListItemClick(props.agenda.id)}>

        <ListItemAvatar>
            {user.Image !== undefined ? <Avatar src={user.Image} alt={user.first_name} /> :
                <Avatar>{props.agenda.event.charAt(0).toUpperCase()}</Avatar>}
        </ListItemAvatar>
        <ListItemText primary={
            <Typography variant={'body1'}>
                {props.agenda.title}
            </Typography>
        } secondary={
            <Typography variant={'body2'}>
                {(props.agenda.event)
                    .charAt(0)
                    .toUpperCase()
                    + (props.agenda.event).substring(1)}
            </Typography>
        } />

        {(props.agenda.event === 'anniversary' || props.agenda.event === 'birthdays') &&
            <ListItemSecondaryAction>
                <Button variant={'outlined'} color={'secondary'} onClick={() => handleClick(user, props.agenda.event)}>
                    <CardGiftcardOutlined className={classes.leftIcon} color={'secondary'} />
                    Send wishes
                    </Button>
            </ListItemSecondaryAction>}
    </ListItem>

}

export default CalendarItem;