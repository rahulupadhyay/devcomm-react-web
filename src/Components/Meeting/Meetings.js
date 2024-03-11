import { Add, ExpandMoreOutlined } from "@material-ui/icons";
import { connect } from "react-redux";
import { ExpansionPanel, ExpansionPanelDetails, Grid } from "@material-ui/core";
import { ExpansionPanelSummary, Typography } from "@material-ui/core/es";
import Fab from "@material-ui/core/es/Fab";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import React, { Component } from "react";
import withStyles from "@material-ui/core/es/styles/withStyles";

import { MeetingService } from "../../data/services";
import { MENU_MEETINGS } from "../common/AppBar/DCAppBar";
import { updateDrawerMenu } from "../../Store/actions";
import EmptyView from "../EmptyView/EmptyView";
import MeetingView from "./MeetingView";
import SearchView from '../SearchView/SearchView';
import SkeletonLoading from "../Loaders/SkeletonLoading";

import './meeting.css';

const styles = theme => ({
    root: {
        position: 'relative',
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        margin: theme.spacing(1)
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
});

class Meetings extends Component {

    state = {
        isLoading: true,
        selectedValue: 0,
        meetings: [],
        todaysMeetings: [],
        agendaMeetings: [],
        pastMeetings: [],
        keyword: ''
    };

    handleSearch = (keyword) => {
        this.setState({
            keyword: keyword
        })
    };

    handleTabChange = (event, value) => {
        this.setState({
            selectedValue: value
        });
    };
    componentDidMount() {
        this.props.changeDrawerMenu(MENU_MEETINGS);
        MeetingService.getMeetings()
            .then((response) => {
                let allMeetings = response.values;

                let todaysMeegings = allMeetings.filter((value) => {
                    const utcStartTime = moment.utc(value.start_time).toDate();
                    const localTime = moment.utc(utcStartTime).local().format('MM-DD-YYYY');
                    return localTime === moment().format('MM-DD-YYYY');
                })

                let agendaMeetings = allMeetings.filter((value) => {
                    return new Date(value.start_time).getTime() > new Date().getTime();
                })

                let pastMeetings = allMeetings.filter((value) => {
                    return new Date(value.start_time).getTime() < new Date().getTime();
                })

                this.setState({
                    isLoading: false,
                    meetings: allMeetings,
                    todaysMeetings: todaysMeegings,
                    agendaMeetings: agendaMeetings,
                    pastMeetings: pastMeetings,

                })
            })
    }

    render() {
        const { classes } = this.props;
        return (this.state.isLoading ? <SkeletonLoading /> :
            <div>
                <Typography variant={"h5"}>
                    Meetings
                </Typography>
                <SearchView handleSearch={this.handleSearch} />
                <Grid
                    style={{ marginTop: '8px' }}
                    spacing={2}
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="flex-start"
                >
                    <Grid item xs={6}>
                        <Paper className='paper'>
                            <Typography style={{ textAlign: 'center', paddingTop: '8px' }} variant={"h6"}>
                                Today
                            </Typography>
                            {this.getSelectedView(0)}
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className='paper'>
                            <Typography style={{ textAlign: 'center', paddingTop: '8px' }} variant={"h6"}>
                                Upcoming
                            </Typography>
                            {this.getSelectedView(1)}

                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreOutlined />}
                            >
                                <Typography style={{ textAlign: 'center', paddingTop: '8px' }} variant={"h6"}>
                                    History
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid
                                    style={{ marginTop: '16px' }}
                                    spacing={2}
                                    container
                                    direction="row"
                                    justify="space-evenly"
                                    alignItems="flex-start"
                                >
                                    {this.getSelectedView(2)}
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Grid>

                <Fab variant="extended" color="secondary" aria-label="Add Meeting" className={classes.fab}
                    onClick={() => {
                        this.props.history.push("/meetings/meeting/add")
                    }}>
                    <Add className={classes.extendedIcon} />
                    Add Meeting
                </Fab>
            </div>
        )
    }

    getSelectedView = (selectedValue) => {
        switch (selectedValue) {
            case 0:
                return this.state.todaysMeetings.length === 0 ? <EmptyView title={'A fresh start'} message={'Anything to add?'} /> :
                    this.state.todaysMeetings
                        .sort((a, b) => moment(a.start_time).format('HH:mm') > moment(b.start_time).format('HH:MM'))
                        .filter((val, index, arr) => {
                            return val.agenda.toLowerCase().includes((this.state.keyword).toLowerCase());
                        })
                        .map((value) => {
                            return (
                                <MeetingView key={value.meeting_id} meeting={value} agenda={false}
                                    onClick={() => {
                                        this.props.history.push('/meetings/' + value.meeting_id);
                                    }}
                                />
                            )
                        });
            case 1:
                return this.state.agendaMeetings === 0 ? <EmptyView title={'No upcoming meetings'} /> :
                    // moment(a.start_time, "YYYY-MM-DD HH:mm:ss").fromNow() < moment(b.start_time, "YYYY-MM-DD HH:mm:ss").fromNow())
                    this.state.agendaMeetings
                        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                        .filter((val, index, arr) => {
                            return val.agenda.toLowerCase().includes((this.state.keyword).toLowerCase());
                        })
                        .map((value) => {
                            return (
                                <MeetingView key={value.meeting_id} meeting={value} agenda={true}
                                    onClick={() => {
                                        this.props.history.push('/meetings/' + value.meeting_id);
                                    }}
                                />
                            )
                        });
            case 2:
                return this.state.pastMeetings === 0 ? <EmptyView title={'No history found'} /> :
                    // moment(a.start_time, "YYYY-MM-DD HH:mm:ss").fromNow() < moment(b.start_time, "YYYY-MM-DD HH:mm:ss").fromNow())
                    this.state.pastMeetings
                        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                        .filter((val, index, arr) => {
                            return val.agenda.toLowerCase().includes((this.state.keyword).toLowerCase());
                        })
                        .map((value) => {
                            return (
                                <Grid key={value.meeting_id} item xs={4}>
                                    <MeetingView meeting={value} agenda={true}
                                        onClick={() => {
                                            this.props.history.push('/meetings/' + value.meeting_id);
                                        }}
                                    />
                                </Grid>
                            )
                        });

            default:
                return <EmptyView title={'A fresh start'} message={'Anything to add?'} />;
        }

    }


}

const mapDispatchToProps = dispatch => {
    return {
        changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index))
    };
};

export default withStyles(styles, { withTheme: true })(
    connect(null, mapDispatchToProps)(Meetings)
);