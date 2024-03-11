import { OPEN_DIALOG, CLOSE_DIALOG, SHOW_PROGRESS_DIALOG, HIDE_PROGRESS_DIALOG } from "../actions/actionTypes";
const initialState = {
    isOpen: false,
    title: '',
    description: '',
    showProgress: false
};

const dialogReducer = (state = initialState, action) => {
    // console.debug(action.type);
    switch (action.type) {
        case OPEN_DIALOG:
            return {
                ...state,
                isOpen: true,
                title: action.payload.title,
                description: action.payload.description
            };
        case CLOSE_DIALOG:
            return {
                ...state,
                isOpen: false,
                title: '',
                description: ''
            };
        case SHOW_PROGRESS_DIALOG:
            return {
                ...state,
                showProgress: true
            }
        case HIDE_PROGRESS_DIALOG:
            return {
                ...state,
                showProgress: false
            }
        default:
            return state;
    }
}

export default dialogReducer;