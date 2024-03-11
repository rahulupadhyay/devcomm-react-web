import React from 'react';
import TextField from "@material-ui/core/TextField";
import './textInput.css'

const TextInput = (props) => {
    const {
        id,
        label,
        name,
        type,
        error,
        ref,
        autoComplete,
        margin = "normal",
        variant = "outlined",
        required = true,
    } = props.type;
    return (
        <div>
            <TextField
                defaultValue={props.defaultValue}
                onChange={props.onChange}
                className="textInput"
                id={id}
                inputRef={ref}
                required={required}
                error={error}
                label={label}
                type={type}
                name={name}
                autoComplete={autoComplete}
                margin={margin}
                variant={variant}
            />
        </div>
    )
};
export default TextInput;