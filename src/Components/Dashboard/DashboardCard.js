import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { ListItem, ListItemIcon, Typography, Paper } from '@material-ui/core';
import { ListItemText } from '@material-ui/core/es';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: 12,
        textAlign: 'center',
        '&:hover': {
            backgroundColor: '#fafafa',
            cursor: 'pointer'
        }
    }
}))

const DashboardCard = ({ icon, title, body, summary, onClick }) => {
    const classes = useStyles();

    return <Paper className={classes.paper} onClick={onClick}>
        <React.Fragment>
            <ListItem>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText style={{ textAlign: 'start' }} primary={
                    <Typography variant='h5'>
                        {title}
                    </Typography>}
                />
            </ListItem>
            <Typography color='primary' variant='h4' gutterBottom>
                {body}
            </Typography>
            <Typography variant='subtitle2'>
                {summary}
            </Typography>
        </React.Fragment>
    </Paper>
}

export default DashboardCard;