import { Add, DeleteOutline, Edit } from "@material-ui/icons";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import { connect } from "react-redux";
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Grid, Button, IconButton, Typography, List, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { minWidth } from '@material-ui/system';


import DateFnsUtils from '@date-io/date-fns';
import Fab from "@material-ui/core/es/Fab";
import Icon from '@material-ui/core/Icon';
import MaterialTable from 'material-table';
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import React, { useStat, useEffect, useState } from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import SkeletonLoading from "../Loaders/SkeletonLoading";

import { MENU_TIME_TRACKER } from '../common/AppBar/DCAppBar';
import { TimeTrackerService } from '../../data/services';
import { updateDrawerMenu } from "../../Store/actions";
import EmptyView from "../EmptyView/EmptyView";
import ProjectPanel from '../Project/Project';
import SearchView from '../SearchView/SearchView';
import UnderConstruction from "../Loaders/UnderConstruction";

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

const strings = {
    title: "Time Tracker",
    hours: "Hour(s)",
    days: "Day(s)",
    pending: "Pending",
    approved: "Approved",
  };

  const _goToBack = () => {
    this.props.history.goBack();
  };

const renderHeader = () => (
    <Grid>
      <IconButton
        style={{ marginBottom: 6 }}
        color="inherit"
        onClick={_goToBack}
      >
        <BackIcon />
      </IconButton>
      <Typography align="center" display="inline" variant={"h5"}>
        {strings.title}
      </Typography>
    </Grid>
  );


const renderTimeCards = (timeEntries) =>(
    <div style={{ margin: "8px", padding: 12 }}>
    <Grid container>
        {timeEntries.map((l, index) => (
              <ListItemText
                key={index}
                style={{ marginRight: 36 }}
                primary={<Typography variant="h5">{l.taskTitle}</Typography>}
                secondary={
                  <Typography
                    style={{ marginTop: 6 }}
                    variant="h5"
                  >
                    {l.taskDesc}
                  </Typography>
                }
              />
            ))}
    </Grid>
    </div>

);

const TimeTracker = (props) => {
    const [isLoading, setLoading] = useState(true)

    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [timeEntries, setTimeEntries] = useState([])

    const [data, setData] = useState({
        columns: [
            {
                title: 'Project', field: 'project',
                editComponent: props => (
                    <ProjectPanel
                        loadProjectViewOnly={true}
                        handleProjectChange={handleProjectChange}
                    />
                )
            },
            { title: 'Task', field: 'task' },
            { title: 'Task Title', field: 'taskTitle' },
            { title: 'Task Description', field: 'taskDesc' },
            { title: 'Task Date', field: 'taskDate', type: 'date', hint: 'Date' },
            { title: 'Hours', field: 'hours', type: 'numeric' }
        ],
        data: []
    });

    const handleProjectChange = (selectedProject) => {
        if (selectedProject !== null) {
            console.log(selectedProject.value)
            // this.handleInputChange({ target: { name: 'project_id', value: selectedProject.value } })
        } else {
            // this.handleInputChange({ target: { name: 'project_id', value: '' } })
        }
    };

    useEffect(
        () => {
            props.changeDrawerMenu(MENU_TIME_TRACKER);
            getTimeEntries();
        }, {});


    const getTimeEntries = () => {
        setLoading(true);
        TimeTrackerService.getTimeCard("2022-07-01", "2022-07-01")
            .then((response) => {
                setLoading(false);
                if (response.status === 1) {
                    // setTimeEntries(response.values.timeCardData);
                    let mData = [];
                    response.values.timeCardData.forEach(element => {
                        console.log(element)
                        let mTimeCard = {
                            project: element.project_id,
                            task: element.task_id,
                            taskTitle: element.taskTitle,
                            taskDesc: element.taskDescription,
                            taskDate: element.taskDate,
                            hours: element.taskHours
                        }
                        mData.push(mTimeCard);
                    });

                    setTimeEntries(mData);
                }
            });
    }

    const classes = useStyles();

    const handleStartDateChange = (event) => {
        setStartDate(event);
    }

    const handleEndDateChange = (event) => {
        setEndDate(event)
    }

    const reset = (event) => {
        setTimeEntries([])
    }

    const applyFilter = (event) => {
        getTimeEntries();
    }

    return isLoading ? <SkeletonLoading/> : (<div style={{ marginTop: "8px" }}>
    {renderHeader()}
    {renderTimeCards(timeEntries)}

  </div>)
}

const mapDispatchToProps = dispatch => {
    return {
        changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index))
    };
};

export default (connect(
    null,
    mapDispatchToProps
)(TimeTracker));