import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/es/Button/Button";
import Card from "@material-ui/core/es/Card/Card";
import CardActionArea from "@material-ui/core/es/CardActionArea/CardActionArea";
import CardActions from "@material-ui/core/es/CardActions/CardActions";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import CardMedia from "@material-ui/core/es/CardMedia/CardMedia";
import React from 'react';
import Typography from "@material-ui/core/es/Typography/Typography";
import CircularLoader from "../common/CircularLoader";

const useStyles = makeStyles(theme => ({
    card: {
        //width: 300,
        height: '100%'
    },
    media: {
        height: 200,
    }
}))

const Album = (props) => {
    const classes = useStyles();
    let album = props.album;
    let isCollaborator = props.isCollaborator;
    const startDate = new Date(album.start_date);
    const endDate = new Date(album.end_date);
    let dateDuration = (startDate.toLocaleDateString() === endDate.toLocaleDateString()) ? startDate.toLocaleDateString() : startDate.toLocaleDateString() + " to " + endDate.toLocaleDateString()

    return (
        <Card className={classes.card}>
            <CardActionArea style={{ display: 'inline' }}>
                <CardMedia
                    style={{ height: '200px' }}
                    className={classes.media}
                    image={album.cover_image}
                    title={album.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6">
                        {album.title}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2">
                        Date: {dateDuration}

                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions >
                <Button size="small" color="secondary" onClick={() => openPhotos(album.link)}>
                    See Photos
                </Button>
                {
                    isCollaborator &&
                    <div style={{ display: 'flex' }}>
                        <Link to={{
                            pathname: `/albums/add`,
                            state: { detail: album }
                        }}>
                            <Button size="small" color="secondary">
                                Edit
                            </Button>
                        </Link>

                        <Button size="small" color="secondary" onClick={props.handleDelete}>
                            Delete
                    </Button>
                    </div>
                }
            </CardActions>
        </Card>
    );

};


const openPhotos = (albumLink) => {
    window.open(albumLink);
};

export default Album;