import { AccessTimeOutlined, CalendarTodayOutlined, DeleteOutlineOutlined, DescriptionOutlined, EditOutlined, EventAvailableOutlined, EventNoteOutlined, FileCopyOutlined, LocationOnOutlined, ThumbDownOutlined, ThumbsUpDownOutlined, ThumbUpOutlined, ViewAgendaOutlined } from "@material-ui/icons";
import { Avatar, Button, Chip, Divider, Grid, IconButton, LinearProgress, ListItem, ListItemIcon, ListItemText, Paper, Tooltip, Typography } from "@material-ui/core";
import { blue, green, grey, orange, red } from "@material-ui/core/es/colors";
import { makeStyles } from '@material-ui/styles';
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import React, { useEffect, useState } from "react";

import { getUserId } from "../../data/storage";
import { hideProgressDialog, showDialog, showProgressDialog } from "../../Store/actions";
import { MeetingService } from "../../data/services";
import SkeletonLoading from "../Loaders/SkeletonLoading";

import './meeting.css';

const useStyles = makeStyles(theme => ({
    leftIcon: {
        marginRight: theme.spacing(1)
    },
    chipCreator: {
        backgroundColor: blue[300],
        color: '#FFF'
    },
    chipMeetingYes: {
        backgroundColor: green[300],
        color: '#FFF'
    },
    chipMeetingNo: {
        backgroundColor: red[300],
        color: '#FFF'
    },
    chipMeetingMaye: {
        backgroundColor: orange[300],
        color: '#FFF'
    },
    chipMeetingDefault: {
        backgroundColor: grey[300],
        color: '#000'
    }
}))

const MeetingDetails = (props) => {

    const [meeting, setMeeting] = useState({});
    const [members, setMeetingMembers] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [memberStatus, setMemberStatus] = useState('PENDING');
    const [isCreator, setCreator] = useState(false);
    const [isUpdatingStatus, setUpdatingStatus] = useState(false);
    useEffect(
        () => {
            const meeting_id = props.match.params.id;
            // console.debug(meeting_id);
            MeetingService.getMeetingDetails(meeting_id)
                .then((response) => {
                    setLoading(false);
                    if (response.status === 1) {
                        setMeeting(response.values);

                        setMeetingMembers(response.values.members);

                        setCreator(response.values.created_by === getUserId());

                        response.values.members.filter((member, index, array) => {
                            if (member.member_id === getUserId()) {
                                setMemberStatus(member.status);
                            }
                            return true;
                        })
                    } else {
                        props.openDialog('Meeting', response.message);
                        props.history.push({ pathname: `/meetings` });
                    }


                });
        }, {});

    const getDuration = (duration) => {
        const minutes = duration * 60;

        return minutes > 59.59 ? duration + "Hour(s)" : minutes + "Minutes";
    }

    const handleCopy = (meeting) => {
        props.history.push({
            pathname: `/meetings/meeting/add`,
            state: { detail: meeting, editMode: false }
        })

    }
    const handleDelete = (meeting) => {
        if (window.confirm('Are you sure you want to delete this meeting?')) {
            props.showProgress();
            MeetingService.deleteMeeting(meeting.meeting_id)
                .then((response) => {
                    props.hideProgress();
                    props.openDialog('Meeting', 'Meeting deleted successfully');
                })
                .catch((response) => {
                    props.hideProgress();
                    props.openDialog('Meeting', response.message);
                })
            props.history.push('/meetings/')
        }
    }
    const handleEdit = (meeting) => {
        props.history.push({
            pathname: `/meetings/meeting/add`,
            state: { detail: meeting, editMode: true }
        })
    }

    const handleMemberClick = (member_id) => {
        props.history.push(`/employees/${member_id}`);
    }

    const updateMeetingStatus = (status) => {
        setUpdatingStatus(true);
        MeetingService.updateMeetingStatus(meeting.meeting_id, status)
            .then((response) => {
                setUpdatingStatus(false);
                if (response.status === 1) {
                    setMemberStatus(status);
                }
            }).catch((error) => {
                setUpdatingStatus(false);
                console.error('Meeting Status update', error);
            })
    }

    const handleProjectClick = (projectId) => {
        // alert(projectId);
        window.open('https://devtracker.devdigital.com/index.php?route=common/taskboard&project_id=' + projectId);
    }

    const handleTaskClick = (taskName) => {
        // alert(taskName);
        window.open('https://devtracker.devdigital.com/track/' + taskName);
    }

    const utcStartTime = moment.utc(meeting.start_time).toDate();
    const classes = useStyles();
    return isLoading ? <SkeletonLoading /> : <div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant={"h4"}>
                Meeting Details
            </Typography>

            <Tooltip title={"Copy"}>
                <IconButton onClick={() => handleCopy(meeting)}>
                    <FileCopyOutlined />
                </IconButton>
            </Tooltip>

            {/* If the logged in user is the meeting creator then he/she can edit/delete the meeting. 
            Past meeting can not be edited */}
            {
                isCreator && <div>
                    <Tooltip title={"Edit"}>
                        <IconButton disabled={
                            moment().diff(moment.utc(utcStartTime).local(), 'seconds', true) > 0
                        } onClick={() => handleEdit(meeting)}>
                            <EditOutlined />
                        </IconButton></Tooltip>
                    {/* </Link> */}
                    <Tooltip title={"Delete"}><IconButton onClick={() => handleDelete(meeting)}>
                        <DeleteOutlineOutlined />
                    </IconButton></Tooltip>
                </div>

            }

        </div>



        <Grid
            style={{ marginTop: '16px' }}
            container
            direction="row"
            spacing={2}
        >
            <Grid item xs={6}>
                <Paper className='paper'>
                    <Typography style={{ fontWeight: 'bold' }} variant={'body1'}>
                        Agenda
                    </Typography>
                    <ListItem>
                        <ListItemIcon>
                            <ViewAgendaOutlined color={'primary'} />
                        </ListItemIcon>
                        <ListItemText primary={meeting.agenda} />
                    </ListItem>
                    <Divider style={{ margin: '4px' }} />
                    <Typography style={{ fontWeight: 'bold' }} variant={'body1'}>
                        Purpose
                    </Typography>
                    <ListItem>
                        <ListItemIcon>
                            <EventNoteOutlined color={'primary'} />
                        </ListItemIcon>
                        <ListItemText primary={meeting.purpose} />
                    </ListItem>
                    <Divider style={{ margin: '4px' }} />

                    <Typography style={{ fontWeight: 'bold' }} variant={'body1'}>
                        Schedule
                    </Typography>
                    <ListItem>
                        <ListItemIcon>
                            <CalendarTodayOutlined color={'primary'} />
                        </ListItemIcon>
                        <ListItemText primary={
                            moment.utc(utcStartTime).local().format('MMMM DD, YYYY hh:mm A')

                        } secondary={'Time'} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <AccessTimeOutlined color={'primary'} />
                        </ListItemIcon>
                        <ListItemText primary={
                            getDuration(meeting.duration)

                        } secondary={'Duration'} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <LocationOnOutlined color={'primary'} />
                        </ListItemIcon>
                        <ListItemText primary={meeting.location} secondary={'Location'} />
                    </ListItem>
                    {
                        meeting.project_id === 0 && <div>
                            <Divider style={{ margin: '4px' }} />
                            <Typography style={{ fontWeight: 'bold' }} variant={'body1'}>
                                Linked Poject
                            </Typography>
                            <ListItem>
                                <ListItemIcon>
                                    <EventAvailableOutlined color={'primary'} />
                                </ListItemIcon>
                                <ListItemText primary={meeting.project_name} secondary={'Project'} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <EventAvailableOutlined color={'primary'} />
                                </ListItemIcon>
                                <ListItemText primary={meeting.task_name} secondary={'Task'} />
                            </ListItem>
                        </div>

                    }


                </Paper>
            </Grid>

            <Grid item xs={6}>
                <Grid container direction="column"
                    spacing={2}
                    justify="flex-start"
                    alignItems="flex-start">
                    {/* Meeting status view 
                        if meeting is from past OR the creator id is same as the user id then we don't need to take user's action

                    */}

                    {(moment().diff(moment.utc(utcStartTime).local(), 'seconds', true) < 0 && !isCreator) &&
                        <Grid item style={{ width: 'inherit' }}>
                            <Paper className='paper'>
                                <Typography variant={'h6'} gutterBottom>
                                    Are you going?
                            </Typography>
                                <div style={{ marginBottom: '8px' }}>
                                    <Button variant={'outlined'} className={classes.leftIcon}
                                        color={memberStatus === 'YES' && 'primary'}
                                        onClick={() => updateMeetingStatus('YES')}
                                    >
                                        <ThumbUpOutlined className={classes.leftIcon} />
                                        yes
                                </Button>
                                    <Button variant={'outlined'} className={classes.leftIcon}
                                        color={memberStatus === 'NO' && 'primary'}
                                        onClick={() => updateMeetingStatus('NO')}
                                    >
                                        <ThumbDownOutlined className={classes.leftIcon} />
                                        No
                                </Button>
                                    <Button variant={'outlined'} className={classes.leftIcon}
                                        color={memberStatus === 'MAYBE' && 'primary'}
                                        onClick={() => updateMeetingStatus('MAYBE')}
                                    >
                                        <ThumbsUpDownOutlined className={classes.leftIcon} />
                                        Maybe
                                </Button>
                                </div>
                                {isUpdatingStatus && <LinearProgress color={'secondary'} />}
                            </Paper>
                        </Grid>
                    }
                    {/* Members View */}
                    <Grid item style={{ width: 'inherit' }}>
                        <Paper className='paper'>
                            <Typography variant={'h6'}>
                                Members
                             </Typography>
                            {
                                members.map((member, index) => {
                                    return <Chip key={member.member_id}
                                        className={member.member_id === meeting.created_by ? classes.chipCreator :
                                            member.status === 'YES' ? classes.chipMeetingYes :
                                                member.status === 'NO' ? classes.chipMeetingNo :
                                                    member.status === 'MAYBE' ? classes.chipMeetingMaye :
                                                        classes.chipMeetingDefault}

                                        avatar={<Avatar style={{ width: '32px', height: '32px' }} alt={member.member_name} src={member.member_image} />}
                                        // color={member.status === 'YES' ? 'secondary' : 'default'}
                                        //color={member.status === 'YES' ? 'secondary' : 'default'}
                                        onClick={() => handleMemberClick(member.member_id)}
                                        //variant={member.member_id === meeting.created_by ? 'default' : 'outlined'}
                                        label={member.member_name}
                                        style={{ margin: '8px' }}
                                    />
                                })
                            }
                        </Paper>
                    </Grid>
                    {/*Project Details*/}
                    {meeting.project_id !== '0' &&
                        <Grid item style={{ width: 'inherit' }}>
                            <Paper className='paper'>
                                <Typography variant={'h6'}>
                                    Linked Project
                            </Typography>

                                <ListItem button onClick={() => handleProjectClick(meeting.project_id)}>
                                    <ListItemIcon>
                                        <DescriptionOutlined color={'primary'} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant={'body1'}>
                                                {meeting.project_name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant={'body2'}>
                                                Project Name
                                        </Typography>
                                        }
                                    />
                                </ListItem>


                                <ListItem button onClick={() => handleTaskClick(meeting.task_name.split("(")[0])}>
                                    <ListItemIcon>
                                        <DescriptionOutlined color={'primary'} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant={'body1'}>
                                                {meeting.task_name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant={'body2'}>
                                                Task Name
                                        </Typography>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                        </Grid>
                    }
                </Grid>




            </Grid>

        </Grid>
    </div>


}

const mapDispatchToProps = dispatch => {
    return {
        openDialog: (title, description) => dispatch(showDialog({ open: true, title: title, description: description })),
        showProgress: () => dispatch(showProgressDialog()),
        hideProgress: () => dispatch(hideProgressDialog())
    };
};

export default connect(null, mapDispatchToProps)(MeetingDetails);