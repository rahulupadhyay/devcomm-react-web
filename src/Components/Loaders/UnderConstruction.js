import { Typography } from '@material-ui/core/es';
import Lottie from 'lottie-react-web';
import React from 'react'

import underConstruction from './dashboard.json'

const WorkInProgress = () => {
    return <div style={{ textAlign: 'center' }} >
        <Lottie
            width={'75%'}
            options={{
                animationData: underConstruction
            }}
        />
        <Typography variant='h5'>
            Under Construction
        </Typography>
    </div>



};
export default WorkInProgress;