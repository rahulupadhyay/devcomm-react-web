import { connect } from "react-redux";
import Avatar from "@material-ui/core/es/Avatar/Avatar";
import React, { Component } from 'react';

import { getUserImage } from "../../../data/storage";

class UserAvatar extends Component {

    render() {
        // console.log("State: ", this.props.userImage);
        // console.log("Local: ", getUserImage());
        let img = this.props.userImage === undefined ? getUserImage() : this.props.userImage;
        //let userName = this.props.name === undefined ? getUserName() : this.props.name;
        return (
            <Avatar style={{ marginLeft: '10px', marginRight:'10px' }} alt={this.props.userName}
                src={img}
                onClick={this.props.onClick}
            />
        )
    }
}

const mapStateToProps = state => {
    return {
        userImage: state.usr.employeeImage,
        //userName: state.usr.employee.first_name + " " + state.usr.employee.last_name,
    }
};

export default connect(mapStateToProps)(UserAvatar);