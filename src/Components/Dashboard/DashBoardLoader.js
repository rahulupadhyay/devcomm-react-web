import Lottie from 'lottie-react-web';
import React from 'react';

import '../common/common.css';
import loading from './dashboard-lottie.json';

/*Lottie: https://github.com/felippenardi/lottie-react-web*/

const DashboardLoader = ({
    title = "No records found",
    message = ""
}) => {

    return <div style={{ textAlign: 'center' }}>

        <Lottie
            width={'50%'}
            options={{
                animationData: loading
            }}
        />
    </div>

};

export default DashboardLoader;