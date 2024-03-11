import React from 'react';
import { MenuItem, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
import '../common.css';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    }
}))

const DrawerItem = (props) => {
    const classes = useStyles();
    return <Link to={props.linkTo} className="link">
        <MenuItem component="div" onClick={() => props.onClick}
            selected={props.isSelected}>
            <ListItem className={classes.root}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={
                    <Typography className={classes.root}>
                        {props.title}
                    </Typography>
                } />
            </ListItem>
        </MenuItem>
    </Link>

}

export default DrawerItem;