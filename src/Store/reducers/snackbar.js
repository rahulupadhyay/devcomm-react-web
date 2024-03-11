import { SHOW_SNACKBAR, HIDE_SNACKBAR } from "../actions/actionTypes";
import { variant } from "../../Components/common/SnackBar";
const initialState = {
    open: false,
    message: '',
    variant: variant.info
};

const snackbarReducer = (state = initialState, action) => {
    // console.debug(action.payload);
    switch (action.type) {
        case SHOW_SNACKBAR:
            return {
                ...state,
                open: true,
                message: action.payload.message,
                variant: action.payload.variant
            };
        case HIDE_SNACKBAR:
            return {
                ...state,
                open: false,
                message: '',
                variant: action.payload.variant
            };
        default:
            return state;
    }
}

export default snackbarReducer;