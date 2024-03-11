import { Clear, SearchOutlined } from '@material-ui/icons';
import { IconButton, InputAdornment, InputBase, Paper, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
    paper: {
        width: '50%',
        padding: '2px 4px',
        margin: '12px 0px 12px',
        display: "flex",
        alignItems: "center"
    },
    iconPadding: {
        padding: '12px'
    }
}))

const SearchView = ({ handleSearch, placeHolder = "Search" }) => {
    const [keyWord, setKeyword] = useState('');


    const search = (event) => {
        applyKeyword(event.target.value);
    }

    const clearSearch = (event) => {
        event.preventDefault();
        applyKeyword('');
    }

    const applyKeyword = (val) => {
        handleSearch(val);
        setKeyword(val);
    }
    const classes = useStyles();
    return (
        <Paper className={classes.paper}>
            <Tooltip title="Search">
                <IconButton className={classes.iconPadding}>
                    <SearchOutlined />
                </IconButton>
            </Tooltip>

            <InputBase
                fullWidth
                placeholder={placeHolder}
                label="Search"
                value={keyWord}
                name={"search"}
                // type={'search'}
                onChange={search}
                endAdornment={
                    <InputAdornment position="end">

                        {keyWord.length > 0 &&
                            <Tooltip title='Clear Search'>
                                <IconButton onClick={clearSearch}>
                                    <Clear />
                                </IconButton>
                            </Tooltip>
                        }
                    </InputAdornment>
                }
            // variant="outlined"
            />
        </Paper>);
}
export default SearchView;
