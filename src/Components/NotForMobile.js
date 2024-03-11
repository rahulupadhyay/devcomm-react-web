import React from 'react';
import { Typography } from '@material-ui/core/es';
import { Paper, Grid } from '@material-ui/core';

export const NotForMobile = () => {
    return <div className="loginBg" style={{ textAlign: 'center' }}>

        <Grid
            container
            spacing={2}>
            <Grid item>
                <div>
                    <img
                        style={{ width: '20%', height: '20%' }}
                        src='https://devtracker.devdigital.com/media/devcomm/logo.png' alt='DevComm' />

                    <Typography variant='h3'>
                        DevComm
            </Typography>
                </div>
            </Grid>

            <Grid item xs={6}>
                <div >
                    <Typography variant='body1'>
                        Android App
                 </Typography>
                    <a href='https://play.google.com/store/apps/details?id=com.devdigital.devcomm&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                        <img alt='Get it on Google Play'
                            style={{ width: '75%' }}
                            src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' />
                    </a>
                </div>
            </Grid>

            <Grid item xs={6}>
                <div>
                    <Typography variant='body1'>
                        iPhone App
            </Typography>
                    <a href='https://install.devdigital.com/D5312A'>
                        <img alt='Get it on DevDigital'
                            style={{ width: '68%', padding: '8px' }}
                            src='https://devtracker.devdigital.com/media/devcomm/badges/dd_iPhone_badge_dark.png' />
                    </a>
                </div>
            </Grid>

            <Grid item xs={12}>
                <Paper style={{ margin: '12px', padding: '4px', textAlign: 'center' }}>
                    <Typography variant='body1' gutterBottom>
                        DevComm Application is available on the Store.
            </Typography>
                    <Typography variant='body2' gutterBottom>
                        This site is not meant to be load on the mobile view.<br></br>For better presentation view, please install the app from the respective store.
            </Typography>



                    <Typography variant='subtitle1'>Contact App Team for the help.</Typography>
                </Paper>

            </Grid>
        </Grid>

    </div>
}