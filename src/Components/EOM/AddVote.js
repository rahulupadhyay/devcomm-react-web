import { Button, Card, TextField, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import moment from 'moment';
import React, { Component } from 'react';

import { ContactService, EOMService } from '../../data/services';
import { getUserId } from '../../data/storage';
import { showDialog } from "../../Store/actions";
import MultipleSelect from '../MultipleSelect';

class AddVote extends Component {


    /**
     * User Roles
     * "1"	"Admin"
     * "13"	"Team Manager(Designer)"
     * "14"	"Project Manager"
     * "18"	"Team Manager(QA)"
     * "20"	"Baroda Network Admin"
     * "21"	"Baroda Business Development Manager"
     * "3"	"Team Manager(Developer)"
     *
     */
    state = {
        isLoading: true,
        members: [],
        selectedMember: [],
        reason: ''
    };

    componentDidMount() {
        ContactService.getContacts()
            .then((response) => {
                if (response.status === 1) {
                    let allMembers = [];
                    let adminRoles = ["1", "3", "13", "14", "18", "20", "21"];
                    response.values.filter((value, index) => {
                        // We can not vote for Manager level person & Can not vote for self
                        return !adminRoles.includes(value.role_id) && value.id !== getUserId();
                    }).map((data, index) => {
                        let member = {
                            value: data.id,
                            label: data.first_name + " " + data.last_name,
                        };
                        return allMembers.push(member);
                    });

                    this.setState({
                        members: allMembers,
                        isLoading: false
                    });

                }
            })
    }

    render() {
        return (
            <div style={{ width: '75%' }}>
                <Typography variant={"h5"}>
                    Employee of the Month
                </Typography>

                <Card raised={true} style={{ padding: '24px', marginTop: '24px' }}>
                    <form style={{ margin: '16px' }} onSubmit={this.handleSubmit} autoComplete="on">
                        <Typography variant={"h6"}>
                            Nominating for the month: {moment().format("MMMM YYYY")}
                        </Typography>

                        <Typography variant={"caption"}>
                            Who are you nominating?
                        </Typography>

                        <MultipleSelect
                            isLoading={this.state.isLoading}
                            items={this.state.members}
                            selectedItems={this.state.selectedMember}
                            onChange={this.handleChange}
                            isMultiple={false}
                            placeHolder={"Select any"}
                        />

                        <TextField fullWidth={true}
                            label="Why are you nominating this person?"
                            name={"reason"}
                            required={true}
                            multiline={true}
                            rows={2}
                            helperText={this.getReasonHelperText()}
                            rowsMax={5}
                            onChange={this.handleInputChange}
                            margin="normal"
                        //variant="outlined"
                        />
                        <div style={{ marginTop: '10px', textAlign: "right" }}>
                            <Button type="submit" variant={"contained"} color={"primary"} onClick={() => this.handleSubmit}>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        )
    }

    getReasonHelperText = () => {
        return <div>
            When putting in your reasons please be as specific as possible.
            <ul>
                e.g.,
                <li>Bob took on the initiative to learn the PowPow plugin and now we are using this in over  5 websites.</li>
                <li>Sally taught us a new method for integrating Instagram and it sped up sites with this functionality by 10 hours</li>
                <li>Rodrigo took time to make me feel welcome as a new employee. He did this by taking me on a tour of the lunch places around the office.</li>
                <li>Paola helped me overcome a problem in my code. I could not figure out where my calculation was wrong.  She took time even with her own projects to trace everything and figured it out. She didn't just find it for me but showed me how to trace it so I know how to do it next time.</li>
            </ul>
        </div>
    }

    handleChange = (selectedMember) => {
        // console.log("selectedMember: ", selectedMember);
        this.setState({ selectedMember });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.selectedMember === null) {
            alert('Please select the nominee!');
            return;
        }
        const nominee = this.state.selectedMember[0].value;
        const reason = this.state.reason;
        EOMService.addNomination(nominee, reason)
            .then((res) => {
                this.props.openDialog('DevComm - EOM', res.message)
                if (res.status === 1) {
                    this.props.history.push("/eom");
                }
            });

    };
}

const mapDispatchToProps = dispatch => {
    return {
        openDialog: (title, description) => dispatch(showDialog({ open: true, title: title, description: description }))
    };
};
export default connect(null, mapDispatchToProps)(AddVote);
