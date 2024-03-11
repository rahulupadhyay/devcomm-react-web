import React from 'react'
import Lottie from 'lottie-react-web';
import loading from './pacman.json'
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core/es';

const useStyes = makeStyles(theme => ({
    container: {
        // position: "absolute",
        // top: '36%',
        // left: '50%',
        textAlign: "center"
    }
}))

const SkeletonLoading = () => {
    const classes = useStyes()
    return <div className={classes.container} >
        <Lottie
            width={'50%'}
            options={{
                animationData: loading
            }}
        />
        <Typography variant='h5'>
            Please wait...
        </Typography>
    </div>



};
export default SkeletonLoading;