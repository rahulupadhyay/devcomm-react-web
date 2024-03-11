import Lottie from 'lottie-react-web';
import React from 'react';

import notFound from './404.json';

const NotFound = () => {
    return <div className="loginBg">

        <Lottie
            width={'50%'}
            options={{
                animationData: notFound
            }}
        />

    </div>
};
export default NotFound;