import { CancelRounded } from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";
import classNames from 'classnames';
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import React from 'react';
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/es/styles/withStyles";

const styles = theme => ({
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25) }px`,
    },
    chipFocused: {
        backgroundColor: theme.palette.grey[900]
    },
    noOptionsMessage: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    }
});

const NoOptionsMessage = (props) => {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
};

const inputComponent = ({ inputRef, ...props }) => {
    return <div ref={inputRef} {...props} />;
};

const Control = (props) => {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
};

const Option = (props) => {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
};

const Placeholder = (props) => {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
};

const ValueContainer = props => {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
};


const MultiValue = (props) => {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelRounded {...props.removeProps} />}
        />
    );
};

const Menu = (props) => {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
};

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer,
};


const MultiSelect = ({
    classes,
    items = [],
    selectedItems = [],
    handleChange,
    placeHolder = "Select",
    isMulti = true,
    isLoading = false
}) => {
    return <div>
        <Select
            classes={classes}
            options={items}
            components={components}
            value={selectedItems}
            onChange={handleChange}
            placeholder={placeHolder}
            isMulti={isMulti}
            isClearable={true}
            isLoading={isLoading}
        />
    </div>
};

export default withStyles(styles, { withTheme: true })(MultiSelect);