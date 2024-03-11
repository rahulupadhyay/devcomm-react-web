import { IconButton, ListItem, ListItemIcon, Snackbar, SnackbarContent } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { ListItemText, Typography } from '@material-ui/core/es';
import { makeStyles } from '@material-ui/core/styles';
import { CheckCircleOutline, CloseOutlined, ErrorOutline, InfoOutlined } from '@material-ui/icons';
import React from 'react';

export const variantInfo = 'info';
export const variantSuccess = 'success';
export const variantFailure = 'failure';

export const variant = {
    success: 'success',
    failure: 'failure',
    info: 'info',
};


const icon = {
    success: <CheckCircleOutline />,
    failure: <ErrorOutline />,
    info: <InfoOutlined />
};

const useStyles = makeStyles(theme => ({
    icon: {
        minWidth: 32,
        color: 'inherit',
        opacity: 0.9

    },
    info: {
        backgroundColor: theme.palette.secondary.main,
        color: '#fafafa'
    },
    success: {
        backgroundColor: green[600],
        color: '#fafafa'
    },
    failure: {
        backgroundColor: theme.palette.error.dark,
        color: '#fafafa'
    }
}));

const SnackBar = (props) => {
    const classes = useStyles();
    const { message, variant, hideSnackbar, openSnackbar } = props;
    // console.debug('received variant', variant);
    // console.debug('message', message);
    return <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        autoHideDuration={3000}
        open={openSnackbar}
        onClose={hideSnackbar}
        ContentProps={{
            'aria-describedby': 'message-id',
        }}
    >
        <SnackbarContent className={classes[variant]}
            message={
                // <Typography variant={'body1'} color={'inherit'} id='message-id'>
                //     {icon[variant]} {message}
                // </Typography>

                <ListItem dense>
                    <ListItemIcon className={classes.icon}>
                        {icon[variant]}
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography variant={'body1'} color={'inherit'} id='message-id'>
                                {message}
                            </Typography>
                        }

                    />
                </ListItem>

            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color={'inherit'}
                    // className={classes.close}
                    onClick={hideSnackbar}
                >
                    <CloseOutlined />
                </IconButton>
            ]}
        />
    </Snackbar>

}
export default SnackBar;