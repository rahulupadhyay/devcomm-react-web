import React, { PureComponent } from 'react';
import { Button, TextField, Typography, Paper, InputAdornment } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

import Grid from "@material-ui/core/Grid";
import { ViewAgendaOutlined, LocationOnOutlined } from '@material-ui/icons';
import connect from "react-redux/es/connect/connect";
import { getUserId } from "../../data/storage";
import { ContactService, MeetingService } from '../../data/services';
import moment from 'moment';
import { showDialog, showProgressDialog, hideProgressDialog } from "../../Store/actions";
import ProjectPanel from '../Project/Project';
import MultipleSelect from '../MultipleSelect';
import { logger } from '../../common/logger';

class CreateMeeting extends PureComponent {

    mInitialDate = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    state = {
        isLoading: true,
        members: [],
        selectedMembers: [],
        isEditMode: false,
        mDate: this.mInitialDate,// moment().format('YYYY-MM-DD HH:mm:ss'),
        meeting: {
            meeting_id: '',
            agenda: '',
            purpose: '',
            location: '',
            start_time: this.mInitialDate,
            duration: '0.5',
            project_id: '',
            task_id: '',
            member_ids: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    };

    componentWillMount() {
        let allMembers = [];
        let selectedMembers = [];


        let meetingMembers = [];
        meetingMembers.push(getUserId()); // local ids 

        if (this.props.location.state !== undefined) {
            const existingMeeting = this.props.location.state.detail;
            const isEditMode = this.props.location.state.editMode;
            if (!isEditMode) {
                // Meeting has been copied and we need to reset the date and duration
                existingMeeting.start_time = moment().format('YYYY-MM-DD HH:mm:ss');
                existingMeeting.duration = '0.5';
            } else {
                const utcStartTime = moment.utc(existingMeeting.start_time).toDate();
                existingMeeting['start_time'] = moment.utc(utcStartTime).local().format('YYYY-MM-DD HH:mm:ss');
            }

            existingMeeting.members.map((member, index) => {
                logger.log(index);
                return meetingMembers.push(member.member_id);
            })

            this.setState({
                isEditMode: isEditMode,
                meeting: existingMeeting
            })
            // console.log(album);
        }

        ContactService.getContacts()
            .then((response) => {
                response.values.map((data, index) => {
                    // console.log(data.expertise_title);
                    let member = {
                        value: data.id,
                        label: data.first_name + " " + data.last_name,
                    };


                    let val = meetingMembers.find((element) => {
                        return element === data.id;
                    })

                    //this.handleInputChange({ target: { name: 'member_ids', value: meetingMembers.join(',') } })

                    if (val !== undefined) {
                        return selectedMembers.push(member);
                    }
                    return allMembers.push(member);;
                });

                this.setState({
                    isLoading: false,
                    members: allMembers,
                    selectedMembers: selectedMembers
                });
                this.onChange(this.state.selectedMembers);
            });

    }

    render() {
        const { classes } = this.props;
        const { meeting } = this.state;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div>

                    <Typography variant={"h5"}>
                        {this.state.isEditMode ? "Update Meeting" : "Create Meeting"}
                    </Typography>

                    <form onSubmit={this.state.isEditMode ? this.handleSubmitUpdate : this.handleSubmit} autoComplete="on">
                        <Grid
                            style={{ marginTop: '8px' }}
                            spacing={2}
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="flex-start"
                        >
                            <Grid item xs={7}>

                                <Paper className='paper'>
                                    {/*Agenda*/}
                                    <TextField
                                        required={true}
                                        name={'agenda'}
                                        defaultValue={meeting.agenda}
                                        onChange={this.handleInputChange}
                                        label={'Agenda'} variant='outlined' fullWidth={true} />
                                    {/*Agenda*/}

                                    {/*Date Time and Hours*/}

                                    <Grid container
                                        style={{ marginTop: '12px', alignItems: 'center' }}
                                        direction="row"
                                        alignItems="flex-start">

                                        <Grid
                                            style={{ marginRight: '6px' }}
                                            item xs>
                                            <DateTimePicker
                                                required={true}
                                                keyboard
                                                value={this.state.mDate}
                                                disablePast
                                                margin={"normal"}
                                                variant='outlined'
                                                fullWidth={true}
                                                onChange={this.handleDateChange}
                                                views={["year", "month", "day"]}
                                                format={'MMM d yyyy - hh:mm a | z'}
                                                label="Day"
                                            /></Grid>

                                        <Grid
                                            style={{ marginTop: '8px' }}
                                            item xs={2}>
                                            <TextField
                                                required={true}
                                                id="time"
                                                label="Duration"
                                                name={'duration'}
                                                type="number"
                                                onChange={this.handleInputChange}
                                                defaultValue={meeting.duration}
                                                variant='outlined'
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    min: 0.5,
                                                    max: 9,
                                                    step: 0.5, // 5 min
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/*Date Time and Hours*/}

                                    {/*Meeting Details*/}
                                    <Typography style={{ marginTop: '12px', marginBottom: '12px' }} color={"secondary"}
                                        variant={"body1"}>Meeting Details
                                </Typography>

                                    <TextField label={'Purpose'} fullWidth={true}
                                        required={true}
                                        style={{ marginTop: '8px' }}
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">
                                                <ViewAgendaOutlined />
                                            </InputAdornment>),
                                        }}
                                        rows='3'
                                        multiline={true}
                                        name={'purpose'}
                                        onChange={this.handleInputChange}
                                        defaultValue={meeting.purpose}
                                        rowsMax='5'
                                        variant='outlined'
                                    />

                                    <TextField label={'Location'} fullWidth={true}
                                        required={true}
                                        style={{ marginTop: '24px' }}
                                        InputProps={{
                                            endAdornment: (<InputAdornment position="end">
                                                <LocationOnOutlined />
                                            </InputAdornment>),
                                        }}
                                        onChange={this.handleInputChange}
                                        name={'location'}

                                        defaultValue={meeting.location}
                                        variant='outlined'
                                    />
                                    {/*Meeting Details*/}
                                </Paper>

                                {/*Project Details*/}
                                <div style={{ marginTop: '16px' }}>

                                    <ProjectPanel classes={classes}
                                        project_id={meeting.project_id}
                                        task_id={meeting.task_id}
                                        handleProjectChange={this.handleProjectChange}
                                        handleTaskChange={this.handleTaskChange} />
                                </div>
                                {/*Project Details*/}

                            </Grid>
                            <Grid item xs={5}>
                                <Paper className='paper'>
                                    <Typography
                                        color={"secondary"}
                                        variant={"h6"}>
                                        Add Team Member
                                    </Typography>
                                    <div className='meetingView'>
                                        <MultipleSelect
                                            items={this.state.members}
                                            placeHolder={"Select Member"}
                                            selectedItems={this.state.selectedMembers}
                                            onChange={this.onChange}
                                        />

                                    </div>
                                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button style={{ marginRight: '8px' }} onClick={this.handleCancel}>Cancel</Button>
                                        <Button
                                            type="submit"
                                            variant={"contained"}
                                            color={"primary"}>Save</Button>

                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </MuiPickersUtilsProvider>
        );
    }

    isDataValid = () => {
        console.log(this.state.meeting.project_id);
        if (this.state.meeting.project_id !== '' && this.state.meeting.task_id === '') {
            this.props.openDialog('Meeting', 'You forgot to select the task!');
            return false;
        }
        switch (this.state.selectedMembers.length) {
            case 0:
                this.props.openDialog('Meeting', 'You just removed yourself too! Eventhough we will take care adding you in the meeting as a Creator.');
                return false;
            case 1:
                this.props.openDialog('Albums', 'Are you going alone for the meeting? Please add your team member.');
                return false;
            default:
                return true;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.isDataValid()) {
            // console.debug(this.state.meeting);
            this.props.showProgress();
            MeetingService.addMeeting(this.state.meeting)
                .then((response) => {
                    this.props.hideProgress();
                    this.props.openDialog('DevComm Meeting', response.message);
                    if (response.status === 1) {
                        this.goBackToMeetings();
                    }
                })
                .catch((response) => {
                    this.props.hideProgress();
                    this.props.openDialog('oops!', 'Something went wrong.');
                });
        }
    }

    handleSubmitUpdate = (event) => {
        event.preventDefault();
        if (this.isDataValid()) {
            // console.debug(this.state.meeting);
            this.props.showProgress();
            MeetingService.updateMeeting(this.state.meeting)
                .then((response) => {
                    this.props.hideProgress();
                    this.props.openDialog('DevComm Meeting', response.message);
                    if (response.status === 1) {
                        this.goBackToMeetings();
                    }
                })
                .catch((response) => {
                    this.props.hideProgress();
                    this.props.openDialog('oops!', 'Something went wrong.');
                });

        }
    }

    handleCancel = () => {
        if (window.confirm('Discard changes?')) {
            this.goBackToMeetings();
        }
    }

    goBackToMeetings = () => {
        this.props.history.push("/meetings");
    }

    handleInputChange = (event) => {
        // console.debug('event', event.target);
        let localMeeting = this.state.meeting;
        localMeeting[event.target.name] = event.target.value;
        // console.debug('Start Time Changed: ', localMeeting.start_time);
        this.setState({
            meeting: localMeeting,
        });
    };

    handleDateChange = (mDate) => {
        // let localMeeting = this.state.meeting;
        // localMeeting['start_time'] = mDate;
        // console.debug(localMeeting);
        let _mDate = moment(mDate).format('YYYY-MM-DD HH:mm:ss');
        this.setState({
            mDate: _mDate
        })
        this.handleInputChange({ target: { name: 'start_time', value: _mDate } })
    }

    onChange = (selectedItems) => {
        // console.debug('selected Members', selectedItems);
        let mSelectedMembers = [];
        selectedItems.map((item) => {
            return mSelectedMembers.push(item.value);
        })
        this.handleInputChange({ target: { name: 'member_ids', value: mSelectedMembers.join(',') } })
        this.setState({
            selectedMembers: selectedItems
        });
        // console.debug('selected Members', mSelectedMembers);
    }

    handleProjectChange = (selectedProject) => {
        if (selectedProject !== null) {
            this.handleInputChange({ target: { name: 'project_id', value: selectedProject.value } })
        } else {
            this.handleInputChange({ target: { name: 'project_id', value: '' } })
        }
    };

    handleTaskChange = (selectedProjectTask) => {
        if (selectedProjectTask !== null) {
            this.handleInputChange({ target: { name: 'task_id', value: selectedProjectTask.value } })
        } else {
            this.handleInputChange({ target: { name: 'task_id', value: '' } })
        }
    };

}

const mapDispatchToProps = dispatch => {
    return {
        openDialog: (title, description) => dispatch(showDialog({ open: true, title: title, description: description })),
        showProgress: () => dispatch(showProgressDialog()),
        hideProgress: () => dispatch(hideProgressDialog())
    };
};
export default connect(null, mapDispatchToProps)(CreateMeeting);
