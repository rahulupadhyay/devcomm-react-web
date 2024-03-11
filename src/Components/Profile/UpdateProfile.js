import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/es/Button/Button";
import { MESSAGE_PROFILE_UPDATE_SUCCESS } from "../../common";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import Grid from "@material-ui/core/es/Grid/Grid";
import TextField from "@material-ui/core/es/TextField/TextField";
import connect from "react-redux/es/connect/connect";
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import Card from "@material-ui/core/es/Card/Card";
import ChangeProfileImage from "./ChangeProfileImage";

import { updateUserProfile, showDialog } from "../../Store/actions";
import { ProgressDialog } from "../Dialogs";
import { getUserId, isLoggedIn } from "../../data/storage";
import { ContactService, ProfileService } from "../../data/services";
import { Paper, Typography, IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import BackIcon from "@material-ui/icons/ArrowBackIos";


class UpdateProfile extends Component {

    state = {
        openSnackbar: false,

        open: false,
        isLoading: true,
        changePasswordButtonText: 'Change Password',
        isChangePasswordButtonDisabled: false,
        showProgress: false,
        showPassword: false,
        employees: [],
        current_password: '',
        new_password: '',
        me: {
            user_id: null,
            first_name: null,
            last_name: null,
            gmailId: null,
            address: null,
            birth_date: null,
            phone: null,
            whatsapp_number:null,
            // employee_expertise: null,
            emergency_name:null, 
            emergency_relation:null,
            emergency_phone:null,
        }
    };

    handleInputChange = (event) => {
        // console.log(event.target.name, event.target.value);
        let localMe = this.state.me;
        localMe[event.target.name] = event.target.value;
        this.setState({
            me: localMe
        });
    };

    handlePasswordChange = (event) => {
        // console.log(event.target.name, event.target.value);
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.updateUser(this.state.me);
    };

    handleChangePassword = (event) => {
        event.preventDefault();
        this.setState({
            isChangePasswordButtonDisabled: true,
            showProgress: true,
            changePasswordButtonText: 'Updating password...'
        })
        ProfileService.updatePassword(this.state.current_password, this.state.new_password)
            .then((response) => {
                // alert(response.message);
                this.props.openDialog('Profile Update', response.message);
                if (response.status === 1) {
                    this.setState({
                        current_password: '',
                        new_password: ''
                    })
                }
                this.resetState();
            })
            .catch((response) => {
                this.props.openDialog('Error', response.message);
                this.resetState();
            })
    };

    handleClickShowPassword = () => {
        let mShowPasswordStatus = this.state.showPassword;
        this.setState({ showPassword: !mShowPasswordStatus })
    }

    resetState = () => {
        this.setState({
            isChangePasswordButtonDisabled: false,
            showProgress: false,
            changePasswordButtonText: 'Change Password'
        })
    }

    componentDidMount() {
        let user_id = getUserId();
        // console.log("user_id", user_id);
        // const {match: {params}} = this.props;

        if (this.props.employees.length) {
            // console.log("load data from reducer");
            let employees = this.props.employees;
            let emp = employees.filter(employee => employee.id === user_id);
            this.setData(emp[0]);

        } else {
            // console.log("API CALL");
            ContactService.getContact(user_id)
                .then((response) => {
                    let emp = response.values;
                    this.setData(emp);
                })
        }
    }

    setData = (user) => {
        this.setState({
            isLoading: false,
            // user: user,
            me: {
                user_id: getUserId(),
                first_name: user.first_name,
                last_name: user.last_name,
                email:user.email,
                location:user.address,
                user_role:user.user_role,
                department: user.department,
                gmailId: user.gmailId,
                address: user.address,
                birth_date: user.birth_date,
                phone: user.phone,
                whatsapp_number: user.whatsapp_number,
                emergency_name: user.emergency_name,
                emergency_relation:user.emergency_relation,
                emergency_phone:user.emergency_phone
            }
        })
    };

    _goToBack = () => {
        this.props.history.goBack();
      };

    renderHeader = (me) => (
        
    <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center">
            <Grid>
            <IconButton
                style={{ marginBottom: 6 }}
                color="inherit"
                onClick={this._goToBack}>
                <BackIcon />
            </IconButton>

          <Typography display="inline" variant={"h5"} gutterBottom>
                {"Update Profile"}
            </Typography >
            </Grid>
        <Button
            form = 'update-profile'
            type="submit"
            variant="contained"
            color="secondary">
            Save Changes
        </Button>
        
        </Grid>
      );

    render() {
        if (isLoggedIn() === null) {
            this.props.history.push("/");
            return null;
        }

        if (this.props.status === 1) {
            this.props.openDialog('Profile Update', 'Profile updated successfully');
        }

        let me = this.state.me;
        // console.log(me['birth_date']);
        return (
            this.state.isLoading ? <LinearProgress color="secondary" /> :
                <div >
                    {this.renderHeader(me)}
                    <MuiPickersUtilsProvider utils={DateFnsUtils} >
                        <div style={{
                            align: "center",
                            marginLeft: "48px",
                            marginRight: "48px",
                            marginTop: "16px",
                  }}>

                        <Grid
                            spacing={2}
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="flex-start">

                            {/* Profile Image and Basic Information*/}
                            <Grid item xs={3}>
                                <Card raised={true} style={{ padding: 16 }}>
                                <Typography variant="h4" gutterBottom style={{marginTop: "8px", marginBottom: "16px"}}>
                                    Profile
                                </Typography>
            
                                <Grid
                                    spacing={4}
                                    container
                                    direction="column"
                                    justify="center"    
                                    alignItems="center">
                                  <Grid item>
                                    <img className="bigAvatar" src={this.props.employeeImage}
                                            alt={me.firstName}  />
                                    </Grid>
                                    <Grid item>
                                    <Button color={"secondary"} variant={"contained"}
                                                onClick={this.handleClickOpen}>Change Image</Button>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h4" gutterBottom color="FAFAFA"  align="center">
                                            {me.first_name + " " + me.last_name}
                                        </Typography >
                                        <Typography align="center" gutterBottom>
                                            {me.user_role}
                                        </Typography >
                                        <Typography  variant="subtitle1" align="start" style={{ fontWeight: 600, marginTop:"16px" }}>
                                            DEPARTMENT
                                        </Typography >
                                        <Typography  variant="subtitle1" gutterBottom align="start">
                                            {me.department}
                                        </Typography >
                                        <Typography  variant="subtitle1" align="start" style={{ fontWeight: 600, marginTop:"16px" }}>
                                            EMAIL
                                        </Typography >
                                        <Typography  variant="subtitle1" gutterBottom align="start">
                                            {me.email}
                                        </Typography >
                                        <Typography  variant="subtitle1" align="start" style={{ fontWeight: 600, marginTop:"16px" }}>
                                            PHONE
                                        </Typography >
                                        <Typography  variant="subtitle1" gutterBottom align="start">
                                            {me.phone}
                                        </Typography >
                                        <Typography  variant="subtitle1" align="start" style={{ fontWeight: 600, marginTop:"16px" }}>
                                            ADDRESS
                                        </Typography >
                                        <Typography  variant="subtitle1" gutterBottom align="start">
                                            {me.address}
                                        </Typography >
                                    </Grid>
                                </Grid>
                                </Card>                                   
                            </Grid>    
                            {/* Profile Settings*/}
                            <Grid item xs={9}>
                            <Card raised={true} style={{ padding: 16 }}>
                                <Typography variant="h4" gutterBottom style={{marginTop: "8px"}}>
                                    Personal Information
                                </Typography>
                                <Grid
                                    container
                                    direction="row"
                                    justify="start"
                                    alignItems="center">
                                    
                                    <form onSubmit={this.handleSubmit} autoComplete="on" id="update-profile">
                                                    <Grid
                                                        spacing={2}
                                                        container
                                                        direction="row"
                                                        justify="space-evenly"
                                                        alignItems="flex-start"
                                                    >
                                                        <Grid item xs={6}>
                                                            <TextField fullWidth={true}
                                                                label="First Name"
                                                                name={"first_name"}
                                                                required={true}
                                                                defaultValue={me.first_name}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField fullWidth={true}
                                                                label="Last Name"
                                                                name={"last_name"}
                                                                required={true}
                                                                defaultValue={me.last_name}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField fullWidth={true}
                                                                label="Phone"
                                                                type={"tel"}
                                                                name={"phone"}
                                                                required={true}
                                                                defaultValue={me.phone}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField fullWidth={true}
                                                                label="WhatsApp"
                                                                type={"tel"}
                                                                name={"whatsapp_number"}
                                                                defaultValue={me.whatsapp_number}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>

                                                            <DatePicker
                                                                keyboard
                                                                margin={"normal"}
                                                                fullWidth={true}
                                                                disableFuture
                                                                variant="outlined"
                                                                views={["year", "month", "day"]}
                                                                format="MM/dd/yyyy"
                                                                label="Birth Date"
                                                                value={me.birth_date}
                                                                onChange={this.handleDateChange}
                                                                mask={value =>
                                                                    // handle clearing outside if value can be changed outside of the component
                                                                    value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : []
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField fullWidth={true}
                                                                id="outlined-multiline-static"
                                                                label="Address"
                                                                multiline
                                                                name={"address"}
                                                                rows="4"
                                                                rowsMax="5"
                                                                defaultValue={me.address}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        
                                                    </Grid>

                                                    {/* <Skills
                                                        onChange={this.handleSkillChange} /> */}
                                                   

                                                <Typography variant="h4" gutterBottom style={{marginTop: "8px"}}>
                                                    Emergency Contact Information
                                                </Typography>
                                                
                                                <Grid
                                                        spacing={2}
                                                        container
                                                        direction="row"
                                                        justify="start"
                                                        alignItems="flex-start"
                                                    >
                                                        <Grid item xs={6}>
                                                    
                                                            <TextField fullWidth={true}
                                                                label="Name"
                                                                name={"emergency_name"}
                                                                value={me.emergency_name}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField fullWidth={true}
                                                                label="Relation"
                                                                name={"emergency_relation"}
                                                                value={me.emergency_relation}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                    
                                                        <Grid item xs={6}>
                                                            <TextField fullWidth={true}
                                                                label="Phone"
                                                                type={"tel"}
                                                                name={"emergency_phone"}
                                                                value={me.emergency_phone}
                                                                onChange={this.handleInputChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </form>

                                </Grid>
                            </Card>
                            </Grid>
                        </Grid>


                            <Grid
                                style={{ marginTop: '24px'}}
                                container
                                spacing={2}
                                direction="column"
                                justify="center">

                                <Grid item>  
                                    <Card raised={true} style={{ padding: 16 }}>
                                        <Typography variant="h4" gutterBottom style={{marginTop: "8px", marginBottom: "16px"}}>
                                            Password Change
                                        </Typography>
                                        <form onSubmit={this.handleChangePassword}>
                                                    <Grid
                                                        spacing={2}
                                                        container
                                                        direction="row"
                                                        justify="flex-end"
                                                        alignItems="flex-start">
                                                        <Grid item xs={6}>
                                                          <TextField
                                                            fullWidth={true}
                                                            label="Current Password"
                                                            name={"current_password"}
                                                            required={true}
                                                            type="password"
                                                            value={this.state.current_password}
                                                            onChange={this.handlePasswordChange}
                                                            margin="normal"
                                                            variant="outlined"/>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                fullWidth={true}
                                                                label="New Password"
                                                                name={"new_password"}
                                                                required={true}
                                                                type={this.state.showPassword ? 'text' : 'password'}
                                                                value={this.state.new_password}
                                                                onChange={this.handlePasswordChange}
                                                                margin="normal"
                                                                variant="outlined"
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <IconButton aria-label="Toggle password visibility"
                                                                                onClick={this.handleClickShowPassword}>
                                                                                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    )
                                                                }}/>
                                                        </Grid>
                                                        <Grid item xs={3} align="end">
                                                            <Button variant='contained'
                                                                disabled={this.state.isChangePasswordButtonDisabled}
                                                                fullWidth
                                                                type='submit' color='secondary'>
                                                                {this.state.changePasswordButtonText}
                                                            </Button>
                                                        </Grid>
                                                        
                                                        {this.state.showProgress &&
                                                            <LinearProgress />
                                                        }
                                                    </Grid>
                                                  </form>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </MuiPickersUtilsProvider>
                    <Dialog
                        fullWidth={true}
                        maxWidth={'sm'}
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="change-profile-image"
                    >
                        <DialogTitle id="change-profile-image">Change Profile Image</DialogTitle>
                        <DialogContent>
                            <ChangeProfileImage handleResponse={this.handleProfileImage} />
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" onClick={this.handleClose}>
                                Close
                                </Button>
                        </DialogActions>
                    </Dialog>
                    <ProgressDialog open={this.props.isFetching} />

                </div>
        );

    }

    // handleSkillChange = selectedOption => {
    //     // console.log(selectedOption);
    //     let me = this.state.me;
    //     let selectedSkills = [];
    //     selectedOption.map((skill, index, arr) => {
    //         return selectedSkills.push(skill.value);
    //     });
    //     me.employee_expertise = selectedSkills.join(',');

    //     // console.log(me);
    //     this.setState({
    //         me
    //     })
    // };

    handleDateChange = (event) => {
        let localMe = this.state.me;
        localMe['birth_date'] = event;
        this.setState({
            localMe
        })

    };
    handleProfileImage = () => {
        setTimeout(() => {
            this.setState({
                open: false
            });
        }, 500);
        showAlert(MESSAGE_PROFILE_UPDATE_SUCCESS);
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
}

const showAlert = (message) => {
    setTimeout(() => {
        //this.props.openDialog('Profile Update', message)
        alert(message);
    }, 1200);
};

const mapStateToProps = state => {
    return {
        employeeImage: state.usr.employeeImage,
        employees: state.usr.employees,
        isFetching: state.usr.isFetching
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (me) => dispatch(updateUserProfile(me)),
        openDialog: (title, description) => dispatch(showDialog({ open: true, title: title, description: description }))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateProfile);
