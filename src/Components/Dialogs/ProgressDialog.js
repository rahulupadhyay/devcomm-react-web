import React from 'react';
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";

export const ProgressDialog = (props) => {
    let title = props.title || 'Please wait...';
    return (
        <Dialog
            maxWidth={'xs'}
            open={props.open}
            aria-labelledby="loading"
        >
            <DialogTitle id="loading">{title}</DialogTitle>
            <DialogContent>
                <div style={{textAlign: 'center'}}>
                    <CircularProgress color="secondary"/>
                </div>
            </DialogContent>
        </Dialog>
    );
};