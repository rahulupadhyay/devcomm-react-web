import { connect } from "react-redux";
import { ListItemText, Paper, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from '@material-ui/core';
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { CalendarService } from '../../data/services/CalendarService';
import { MENU_HOLIDAYS } from '../common/AppBar/DCAppBar';
import { updateDrawerMenu } from '../../Store/actions';
import CircularLoader from "../common/CircularLoader";

const Holidays = (props) => {
    const [holidays, setHolidays] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);

    const NV_OFFICE_ID = "1";
    const BARODA_OFFICE_ID = "2";

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        props.changeDrawerMenu(MENU_HOLIDAYS);
        CalendarService.getHolidays()
            .then((response) => {
                setLoading(false);
                if (response.status === 1) {
                    setHolidays(response.values);
                }
            })
    }, [])

    const handleTabChange = (event, value) => {
        setSelectedTab(value);
    }

    const getDateDiff = (mDate) => {
        switch (moment().diff(mDate, 'days')) {
            case 0:
                return 'Today'
            case 1:
                return 'Yesterday'
            case -1:
                return 'Tomorrow'
            default:
                return moment(mDate, 'MM/DD/YYYY').fromNow()
        }
    }

    return (

        <div>
            <Typography variant={"h5"}>
                Holidays
                </Typography>

            <Paper style={{ marginTop: '12px' }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary">
                    <Tab label={"Vadodara Office"} />;
                    <Tab label={"Nashville Office"} />;
                </Tabs>
            </Paper>
            <Paper style={{ marginTop: '16px' }}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Office</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {   isLoading? <CircularLoader/>:
                            holidays.filter((value, index, array) => {
                                if (selectedTab === 0) {
                                    return value.office_id === BARODA_OFFICE_ID;
                                } else {
                                    return value.office_id === NV_OFFICE_ID;
                                }
                            }).map((holiday, index) => {
                                return <TableRow key={holiday.id}>
                                    <TableCell scope='row'>
                                        <ListItemText primary={
                                            <Typography variant={'body1'}>
                                                {holiday.title}
                                            </Typography>
                                        }
                                        />

                                    </TableCell>

                                    <TableCell scope='row'>

                                        <ListItemText primary={
                                            <Typography variant={'body1'}>
                                                {moment(holiday.holiday_date).format('MMM Do YYYY')}
                                            </Typography>
                                        } secondary={
                                            getDateDiff(holiday.holiday_date)
                                        }
                                        />

                                    </TableCell>


                                    <TableCell scope='row'>

                                        <ListItemText primary={
                                            <Typography variant={'body1'}>
                                                {holiday.officeName}
                                            </Typography>
                                        }
                                        />

                                    </TableCell>


                                </TableRow>

                            })
                        }
                    </TableBody>
                </Table>
            </Paper>


        </div >
    );

}


const mapDispatchToProps = dispatch => {
    return {
        changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index))
    };
};

export default connect(null, mapDispatchToProps)(Holidays);