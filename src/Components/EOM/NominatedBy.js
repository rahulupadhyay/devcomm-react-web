import React, { useEffect, useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, Typography } from '@material-ui/core';
import { ListItemText } from '@material-ui/core/es';
import { ContactService } from '../../data/services';

const NominatedBy = (props) => {
    const [user, setUser] = useState({});
    useEffect(
        () => {
            ContactService.getContact(props.user.nominated_by)
                .then((response) => {
                    // console.debug(response.values.Image);
                    setUser(response.values);
                })
        }, {})

    return <ListItem alignItems="flex-start">
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

export default NominatedBy;