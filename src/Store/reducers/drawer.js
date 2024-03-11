import { UPDATE_DRAWER_MENU } from "../actions/actionTypes";

const initialState = {
    selectedMenu: 0
};

const drawerReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_DRAWER_MENU:
            return {
                ...state,
                selectedMenu: action.selectedMenu
            };
        default:
            return state;
    }
};

export default drawerReducer;