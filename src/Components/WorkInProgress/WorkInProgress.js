import React from 'react'
import { Typography } from "@material-ui/core";
import Lottie from 'lottie-react-web';
import working from './working.json';
const WorkInProgress = () => {
    return <div style={{ textAlign: 'center' }}>

        <Lottie
            width={'40%'}
            options={{
                animationData: working
            }}
        />
        <Typography variant={'h5'}>
            Work in progress
        </Typography>
    </div>
};
export default WorkInProgress;