import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Fab } from '@material-ui/core';
import { HowToVoteOutlined } from '@material-ui/icons';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import Grid from "@material-ui/core/es/Grid/Grid";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { EOMService } from "../../data/services";
import EOMView from './EOMView';
import WorkInProgress from '../WorkInProgress/WorkInProgress';

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: 16
    },
    root: {
        position: "relative"
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        margin: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
}))

const CurrentEOM = (props) => {

    const [currentEOM, setValues] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isInProgress, setWorking] = useState(false);
    const [slelectedMonthYear, setMonthYear] = useState(moment().subtract(1, 'month'))
    useEffect(
        () => {
            getEOMData(slelectedMonthYear);
        }, []);

    const getEOMData = (mDate) => {
        let mVal = moment(mDate).format("YYYY_MM");
        // console.debug(mVal);
        EOMService.getEOMByYear(mVal)
            .then((response) => {
                // console.log(response);
                setLoading(false);
                setWorking(response.values.length === 0);
                setValues(response.values);
            });
    }

    const handleDateChange = (event) => {
        // console.log("Selected Date:", event);
        setMonthYear(event)
        getEOMData(event);
    };
    const classes = useStyles();
    return <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                keyboard
                disableFuture
                variant="outlined"
                views={["year", "month"]}
                format="MMM yyyy"
                label="Eemployees of the month"
                onChange={handleDateChange}
                value={slelectedMonthYear}
            />
        </MuiPickersUtilsProvider>

        {isLoading ?
            (<LinearProgress color="secondary" />) :

            (
                <div>
                    {
                        isInProgress ? <WorkInProgress /> :
                            <div className={classes.container}>
                                <Grid
                                    container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start">
                                    {
                                        currentEOM.map((eom, index) => {
                                            return (
                                                <Grid item key={index} xs={4}>
                                                    <Link to={"/employees/" + eom.nominee} style={{ textDecoration: 'none' }}>
                                                        <EOMView data={eom} />
                                                    </Link>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </div>
                    }
                    <Link to={"/eom/vote"} style={{ textDecoration: 'none' }}>
                        <Fab
                            variant="extended"
                            color="secondary"
                            aria-label="Edit"
                            className={classes.fab}
                        >
                            <HowToVoteOutlined className={classes.extendedIcon} />
                            Nominate
                         </Fab>
                    </Link>
                </div>
            )}
    </div>
};

export default CurrentEOM;