import React from 'react';
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import Button from "@material-ui/core/es/Button/Button";
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";

export const MessageDialog = (props) => {
    let title = props.title || 'Title';
    let message = props.message || 'Message';
    return (
        <Dialog
            maxWidth={'xs'}
            fullWidth={true}
            open={props.openMessageDialog}
            onClose={props.closeMessageDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.closeMessageDialog} color="primary" autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};