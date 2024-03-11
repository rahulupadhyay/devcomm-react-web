import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import BackIcon from '@material-ui/icons/ArrowBack';
import Paper from "@material-ui/core/es/Paper/Paper";
import Tabs from "@material-ui/core/es/Tabs/Tabs";
import Tab from "@material-ui/core/es/Tab/Tab";
import Grid from "@material-ui/core/es/Grid/Grid";

const styles = {
    flex: {
        flex: 1,
    },
    root: {
        flexGrow: 1
    },
};


const EmployeeDetailsDialog = (props) => {
    let emp = props.selectedEmployee;

    return (
        <div>
            <Dialog
                fullScreen
                open={props.open}
                onClose={props.onClick}
            >
                <div style={{ backgroundColor: '#00a79c' }}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <IconButton color="primary" onClick={props.onClick} aria-label="Close">
                            <BackIcon />
                        </IconButton>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <img style={{ borderRadius: "50%" }} src={emp.Image} alt={emp.first_name} />
                        <Typography variant="h3" color="primary">
                            {emp.first_name + " " + emp.last_name}
                        </Typography>
                    </Grid>
                </div>
                <Paper>
                    <Tabs
                        value={0}
                        onChange
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Item One" />
                        <Tab label="Item Two" />
                        <Tab label="Item Three" />
                    </Tabs>
                </Paper>


            </Dialog>
        </div>
    );

};

export default withStyles(styles)(EmployeeDetailsDialog);