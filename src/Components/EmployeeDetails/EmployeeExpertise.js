import React, { Component,useEffect, useState } from 'react';
import Chip from "@material-ui/core/es/Chip/Chip";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import { ContactService } from "../../data/services";

import { getUserId } from "../../data/storage";
import NotFound from "../NotFound/NotFound";
import EmptyView from "../EmptyView/EmptyView";
import { Container, Grid, ListItem, Typography } from '@material-ui/core';
import CircularLoader from "../common/CircularLoader";

const EmployeeExpertise = (props) => {
// class EmployeeExpertise extends Component 
// {

    const [isLoading, setLoading] = useState(true);
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");
    const [expertise, setExpertise] = useState([]);

    useEffect(
        () => {
            getData();
        });
    // componentDidMount() {
    //     this.getData();
    // }

    const getData = () => {
        // let emp = this.props.employee;
        console.log(props.id);
        ContactService.getSkills(props.id).then((response) => {
           let allExpertise = response.values;
           let hasExpertise = allExpertise.filter((expertise) => expertise.has_expertise === true); 
           console.log(hasExpertise);
          setData(hasExpertise);
        });
    };

    const setData = (expertise) =>{
        let mLastUpdatedOn;
        setLoading(false);
        if(expertise.length>0){
            mLastUpdatedOn = expertise[0].updated_on
            setLastUpdatedOn(mLastUpdatedOn)
        setExpertise(expertise)
        }
        
        
    }

    // render() {
    //     console.log(this.props.employee);
        return (
            isLoading ? <CircularLoader/>:
                    <div style={{ marginTop: 4 }}>
                        {expertise.length === 0 ? <EmptyView title="" message="Yet to add" /> : 
                            <Container>
                            <Typography variant="caption" gutterBottom style={{ textAlign: 'center' }}>
                            Last updated on: {lastUpdatedOn}
                            </Typography>
                            
                            {expertise.map(((expertise, index) => {
                            let level;
                            let levelColor;
                            if(expertise.expertise_level === 1){
                                level = "Novice";
                                levelColor = "none";
                            }else if(expertise.expertise_level === 2){
                                level = "Learning";
                                levelColor = "secondary";
                            }else if(expertise.expertise_level === 3){
                                level = "Experienced";
                                levelColor = "primary";
                            }
                            return (
                                <Tooltip title={level} key={index}>
                                    <Chip
                                        color= {levelColor}
                                        style={{ margin: 2 }}
                                        clickable={true}
                                        label={expertise.expertise_title}
                                        onClick={() => handleExpertiseClick(expertise.expertise_title)}
                                    />
                                    
                                </Tooltip>
                            )
                        }
                        
                            ))}
                            </Container>
                        }
                    </div>
            
        )
    //}
};

const handleExpertiseClick = (skill) => {
    window.open("http://www.google.com/search?q=" + skill);
};

export default EmployeeExpertise;