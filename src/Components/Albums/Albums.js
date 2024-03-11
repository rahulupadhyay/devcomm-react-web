import { AddPhotoAlternateOutlined } from "@material-ui/icons";
import { connect } from "react-redux";
import { Grid, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/es/Fab";
import React, { Component } from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";

import { AlbumService, CollaboratorService } from "../../data/services";
import { MENU_ALBUMS } from '../common/AppBar/DCAppBar';
import { updateDrawerMenu } from '../../Store/actions';
import Album from "./Album";

import SearchView from '../SearchView/SearchView';
import CircularLoader from "../common/CircularLoader";

const styles = theme => ({
    albumRoot: {
        position: "relative",
    },
    albumFab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        margin: theme.spacing(1),
    },
    albumExtendedIcon: {
        marginRight: theme.spacing(1),
    },
});

class Albums extends Component {
    state = {
        isLoading: true,
        albums: new Map(),
        selectedValue: 0,
        selectedYear: new Date().getFullYear,
        years: [],
        keyword: '',
        isCollaborator: false
    };

    componentWillMount() {
        this.props.changeDrawerMenu(MENU_ALBUMS);
        CollaboratorService.isAlbumCollaborator()
            .then((response) => {
                if (response.status === 1) {
                    this.setState({
                        isCollaborator: response.values.is_collaborator
                    })
                }
            })

        AlbumService.getAlbums()
            .then((response) => {
                // console.log(response);
                let all = response.values;
                let years = ['All'];

                all.map((album, index) => {
                    let year = new Date(album.start_date).getFullYear();
                    if (years.indexOf(year) === -1) {
                        years.push(year)
                    }
                    return true;
                });

                let yearAlbums = new Map();

                years.sort((a, b) => a - b).map((year, index) => {
                    let albums = [];
                    all.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)).map((album, index) => {
                        let albumYear = new Date(album.start_date).getFullYear();
                        if (albumYear === year) {
                            albums.push(album);
                        }
                        return true;
                    });
                    return yearAlbums.set(year, albums);
                });

                yearAlbums.set(years[0], all);

                this.setState({
                    isLoading: false,
                    albums: yearAlbums,
                    years: years.sort((a, b) => b - a)
                })
            })
            .catch((res) => {
                // console.error(res)
            });
    };

    handleTabChange = (event, value) => {

        this.setState({
            selectedValue: value
        });
    };

    deleteSelectedAlbum(index, albumId) {
        let userResponse = window.confirm("Delete action can not be undone.");
        userResponse &&
            AlbumService.deleteAlbum(albumId)
                .then((res) => {
                    alert(res.message);
                    if (res.status === 1) {
                        const mAlbums = this.state.albums;

                        mAlbums.splice(index, 1);
                        this.setState({
                            albums: mAlbums
                        })
                    }

                })
    }

    handleSearch = (keyword) => {
        this.setState({
            keyword: keyword
        })
    };

    render() {
        const { classes } = this.props;
        const albums = this.state.albums;
        const selectedValue = this.state.selectedValue;

        return (
            
                <div className={classes.albumRoot}>
                    <Typography variant={"h5"}>
                        Albums
                    </Typography>

                    <SearchView
                        placeHolder="Search album"
                        handleSearch={this.handleSearch} />

                    <Paper style={{ marginTop: '12px' }}>
                        <Tabs
                            value={selectedValue}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {this.state.isLoading ? 
                                <Tab key={selectedValue} label={"ALL"} />: 
                                this.state.years
                                    .map((year, index) => {
                                        return (<Tab key={index} label={year} />);
                                    })
                            }
                        </Tabs>
                    </Paper>

                    <Grid
                        style={{ marginTop: '12px' }}
                        container
                        spacing={2}
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start">
                        
                        {
                            this.state.isLoading? <CircularLoader/>:
                            albums.get(this.state.years[selectedValue])
                                .filter((val, index, arr) => {
                                    return val.title.toLowerCase().includes((this.state.keyword).toLowerCase());
                                })
                                .map((album, index) => {
                                    return (
                                        <Grid item xs={3} key={index}>
                                            <Album album={album} isCollaborator={this.state.isCollaborator} />
                                        </Grid>)
                                })
                        }
                    </Grid>
                    {this.state.isCollaborator &&
                        <Link to={`/albums/add`}>
                            <Fab variant="extended" color="secondary" aria-label="Add New" className={classes.albumFab}>
                                <AddPhotoAlternateOutlined className={classes.albumExtendedIcon} />
                                Add New
                            </Fab>
                        </Link>
                    }
                </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        changeDrawerMenu: (index) => dispatch(updateDrawerMenu(index))
    };
};

export default withStyles(styles)(connect(
    null,
    mapDispatchToProps
)(Albums));