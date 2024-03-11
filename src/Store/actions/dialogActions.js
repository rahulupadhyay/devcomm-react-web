import {
    OPEN_DIALOG,
    CLOSE_DIALOG,
    SHOW_PROGRESS_DIALOG,
    HIDE_PROGRESS_DIALOG
} from "./actionTypes";

export const showDialog = (props) => {
    return dispatch => {
        dispatch({
            type: props.open ? OPEN_DIALOG : CLOSE_DIALOG,
            payload: props
        });
    }
}

export const showProgressDialog = () => {
    return dispatch => {
        dispatch({
            type: SHOW_PROGRESS_DIALOG
        });
    }
}

export const hideProgressDialog = (props) => {
    return dispatch => {
        dispatch({
            type: HIDE_PROGRESS_DIALOG
        });
    }
}

