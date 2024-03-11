import {
    SHOW_SNACKBAR,
    HIDE_SNACKBAR
} from "./actionTypes";

export const showSnackbar = (props) => {
    // console.debug(props);
    return dispatch => {
        dispatch({
            type: props.open ? SHOW_SNACKBAR : HIDE_SNACKBAR,
            payload: props
        });
    }
}