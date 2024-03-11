import React, { Component } from "react";
import { connect } from "react-redux";
import "./loginpage.css";
import { Redirect } from 'react-router-dom';
import "../../../node_modules/material-design-iconic-font/dist/css/material-design-iconic-font.min.css";
import Button from "@material-ui/core/Button";
import TextInput from "../common/TextInput/TextInput";
import { authenticate } from "../../Store/actions/index";
import Typography from "@material-ui/core/Typography";
import { isLoggedIn } from "../../data/storage";
import { Paper } from "@material-ui/core";
import { ProgressDialog } from "../Dialogs";
import { red } from "@material-ui/core/colors";


class LoginPage extends Component {

    state = {
        email: "",
        password: "",
        isEmailValid: true,
        isPasswordValid: true,
        isLoading: false
    };

    handleInputChange = (event) => {
        // console.log(event.target.name, event.target.value);
        this.setState({
            [event.target.name]: event.target.value,
        });

        if (event.target.name === "email") {
            this.setState({
                isEmailValid: event.target.name === "email" ? (/^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(.[A-Z0-9-]+)+$/i.test(event.target.value)) : false,
            });
        }

        if (event.target.name === "password") {
            this.setState({
                isPasswordValid: event.target.name === "password" ? event.target.value.length > 1 : false
            });
        }

    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.authenticate(this.state.email, this.state.password);
        // this.props.showProgress();
    };



    render() {
        const email = {
            id: "outlined-email-input",
            label: "Email",
            type: "email",
            name: "email",
            autoComplete: "email",
            emailAddress: "",

            error: !this.state.isEmailValid
        };
        const password = {
            id: "outlined-password-input",
            label: "Password",
            type: "Password",
            name: "password",
            autoComplete: "current-password",

            error: !this.state.isPasswordValid
        };


        return isLoggedIn() === 'true' ? (<Redirect to='/dashboard' />) : (
            <div className="container">
                <div className="loginBg">
                    <Paper style={{ textAlign: 'center' }} className="wrap-login">
                        {
                            window.location.hostname.includes('localhost') || window.location.hostname.includes('staging') ?
                                <img className="img" src="../images/login-logo.png" alt="DevDigital" /> :
                                <img src="../images/login-logo.png" alt="DevDigital" />
                        }

                        <Typography variant="h5">
                            DevComm {
                                window.location.hostname.includes('localhost') || window.location.hostname.includes('staging') ?
                                    <Typography variant="h5" color='error'>
                                        STAGING ENVIORNMENT
                                        </Typography>
                                    : ""
                            }
                        </Typography>
                        <form onSubmit={this.handleSubmit}>
                            <TextInput onChange={this.handleInputChange} type={email} />
                            <TextInput onChange={this.handleInputChange} type={password} />

                            <Button
                                style={{ marginTop: '16px' }}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="secondary"
                            >
                                Sign in
                            </Button>

                        </form>
                        <Typography variant='body1' color='error'>
                            {this.props.employee.message}
                        </Typography>
                    </Paper>
                </div>
                <ProgressDialog open={this.props.showProgress} />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        employee: state.usr.employee,
        showProgress: state.dlg.showProgress
    }
};

const mapDispatchToProps = dispatch => {
    return {
        authenticate: (email, password) => dispatch(authenticate(email, password))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage)