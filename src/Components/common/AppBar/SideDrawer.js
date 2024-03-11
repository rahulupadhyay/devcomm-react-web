import { BeachAccessOutlined, ChevronLeftOutlined, DashboardOutlined, HowToVoteOutlined, PhotoLibraryOutlined, SupervisedUserCircleOutlined } from '@material-ui/icons';
import { Divider, Drawer, List } from '@material-ui/core';
import { IconButton } from '@material-ui/core/es';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import React, { useState } from 'react';

import DrawerItem from './DrawerItem';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    drawerPaper: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    }
}));

const SideDrawer = (props) => {

    const [selectedItem, setSelectedItem] = useState(0);
    const [isOpen] = useState(true);
    const [menuItems] = useState([
        {
            'linkTo': '/dashboard',
            'title': 'Dashboard',
            'icon': <DashboardOutlined />
        },
        {
            'linkTo': '/employees',
            'title': 'Employees',
            'icon': <SupervisedUserCircleOutlined />
        },
        {
            'linkTo': '/albums',
            'title': 'Albums',
            'icon': <PhotoLibraryOutlined />
        },
        {
            'linkTo': '/eom',
            'title': 'EOM',
            'icon': <HowToVoteOutlined />
        },
        {
            'linkTo': '/holidays',
            'title': 'Holidays',
            'icon': <BeachAccessOutlined />
        }
    ])

    const handleMenuItemClick = (index) => {
        setSelectedItem(index);
    }

    const classes = useStyles();

    return <Drawer
        variant="permanent"

        classes={{
            paper: classNames(classes.drawerPaper, !isOpen && classes.drawerPaperClose),
        }}
        open={isOpen}>

        <div >
            <IconButton >
                <ChevronLeftOutlined />
            </IconButton>
        </div>
        <Divider />
        <List style={{ marginTop: '16px' }}>
            {
                menuItems.map((menu, index) => {
                    return <DrawerItem key={index} isSelected={(selectedItem !== index)}
                        menu={menu} onClick={() => handleMenuItemClick(index)} />
                })
            }
        </List>

    </Drawer>
}

export default SideDrawer;