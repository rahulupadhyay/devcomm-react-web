import React, { useState, useEffect } from 'react';
import { ContactService } from "../../data/services";

import MultipleSelect from '../MultipleSelect';
import { logger } from '../../common/logger';
import { Button, ButtonGroup, Checkbox, IconButton,Slider } from "@material-ui/core";
import { FormControl, FormControlLabel, Radio,RadioGroup, FormLabel } from "@material-ui/core";
import BackIcon from "@material-ui/icons/ArrowBackIos";
import { Container, Grid, ListItem, List, ListItemText, ListItemIcon, Typography, Card } from '@material-ui/core';
import { getUserId } from "../../data/storage";
import Chip from "@material-ui/core/es/Chip/Chip";
import Tooltip from "@material-ui/core/es/Tooltip/Tooltip";
import CircularLoader from "../common/CircularLoader";


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
        {"Update Specialities/Expertise"}
      </Typography>
    </Grid>
  );

  const _goToBack = () => {
    this.props.history.goBack();
  };  
  
const Skills = (props) => {
    const [isLoading, setLoading] = useState(true)
    const [skills, setSkills] = useState([]);
    // const [skillsNA, setNASkills] = useState([]);
    // const [skillsLearning, setLearningSkills] = useState([]);
    // const [skillsNovice, setNoviceSkills] = useState([]);
    // const [skillsExp, setExpSkills] = useState([]);
    const [lastUpdatedOn, setLastUpdatedOn] = useState("");
    useEffect(() => {
        ContactService.getSkills(getUserId()).then((response) => {
            if(response.values.length>0){
                setLastUpdatedOn(response.values[0].updated_on)
            }
            let skiils = response.values;
            setSkills(skiils);
            // let naSkills = skiils.filter((expertise) => expertise.expertise_level === 0); 
            // setNASkills(naSkills);
            // let learningSkills = skiils.filter((expertise) => expertise.expertise_level === 1); 
            // setLearningSkills(learningSkills);
            // let noviceSkills = skiils.filter((expertise) => expertise.expertise_level === 2); 
            // setNoviceSkills(noviceSkills);
            // let expSkills = skiils.filter((expertise) => expertise.expertise_level === 3); 
            // setExpSkills(expSkills);
            setLoading(false);
         });
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log((event.target).value)
    };

    return (
        <div>
            {renderHeader()}

            <div
                style={{
                marginLeft: "48px",
                marginRight: "48px",
                marginTop: "16px",
                }}
            >
                <Card raised={true} style={{ padding: 8 }}>
                <Typography gutterBottom style={{ marginBottom:'16px' }}>
                    Last updated on: {lastUpdatedOn}
                </Typography>
                {isLoading ? <CircularLoader/>: 
                <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                        {skills.map(((expertise, index) => {
                        let level;
                        let levelColor;
                        if(expertise.expertise_level === 0){
                            level = "N/A";
                        }
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
                            <Grid item>
                              <FormControl>
                                <FormLabel id="expertise-level-group">{expertise.expertise_title}</FormLabel>
                                <RadioGroup
                                  row
                                  aria-labelledby="expertise-level-group"
                                  defaultValue= {""+expertise.expertise_level}
                                  name="radio-buttons-group"
                                  // onChange={handleChange}
                                >
                                  <FormControlLabel value="0" control={<Radio />} label="N/A" />
                                  <FormControlLabel value="1" control={<Radio />} label="Learning" />
                                  <FormControlLabel value="2" control={<Radio />} label="Novice" />
                                  <FormControlLabel value="3" control={<Radio />} label="Experienced" />
                                </RadioGroup>
                              </FormControl>
                            </Grid>  
                        )
                    }))}
                </Grid>}
                </Card>
            </div>
        </div>
    );
}

export default Skills;