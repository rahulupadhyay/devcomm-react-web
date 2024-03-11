import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { VIEW_TYPE_COMFY, VIEW_TYPE_DEFAULT } from "../../common/Strings";

const styles = {
    card: {
        display: 'flex',
        raised: true
    },
    media: {
        height: 300,
        objectFit: 'cover',
    },

    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 120
    },
};


const getThumbnailCard = (classes, props, name) => {
    return <Card className={classes.card} onClick={props.onClick}>
        <CardMedia
            className={classes.cover}
            image={props.data.Image}
            // image={'https://picsum.photos/300?random=' + props.data.id}
            title={props.data.first_name}
        />
        <CardActionArea>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.data.department}
                    </Typography>
                </CardContent>
            </div>
        </CardActionArea>
    </Card>;
};

const getMediaCard = (classes, props, name) => {
    return <Card className={classes.card} onClick={props.onClick}>
        <CardActionArea>
            <CardMedia
                className={classes.media}
                image={props.data.Image}
                // image={'https://picsum.photos/300?random=' + props.data.id}
                title={props.data.first_name}
            />
            <div className={classes.details}>
                <CardContent>
                    <Typography component="h5" variant="h5">
                        {name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.data.department}
                    </Typography>
                </CardContent>
            </div>
        </CardActionArea>
    </Card>;
};

const EmployeeCard = (props) => {
    const { classes } = props;
    let viewType = props.view;
    let name = props.data.first_name + " " + props.data.last_name;
    // console.log(viewType);
    switch (viewType) {
        case VIEW_TYPE_DEFAULT:
            return getMediaCard(classes, props, name);
        case VIEW_TYPE_COMFY:
            return getThumbnailCard(classes, props, name);
        default:
            return getMediaCard(classes, props, name);
    }
};

EmployeeCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeeCard);