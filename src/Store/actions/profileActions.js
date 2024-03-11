import {
    INIT_REQUEST,
    UPDATE_PROFILE,
    UPDATE_PROFILE_IMAGE,
    STORE_USER,
    RESET_RESPONSE,
    OPEN_DIALOG
} from "./actionTypes";


import { setUserImage } from "../../data/storage";
import { ProfileService } from '../../data/services'

export const changeProfileImage = (imgFile) => {
    const storeProfileImage = (res) => {
        if (res.status === 1) {
            // console.log(res.values);
            let imgRes = res.values.Image;
            setUserImage(imgRes);
            return {
                type: UPDATE_PROFILE_IMAGE,
                payload: imgRes,
            }
        } else {
            return {
                type: UPDATE_PROFILE_IMAGE,
                payload: ''
            }
        }
    };
    return dispatch => {
        dispatch({ type: INIT_REQUEST });
        dispatch({ type: RESET_RESPONSE });

        ProfileService.updateProfileImage(imgFile)
            .then((response) => dispatch(storeProfileImage(response)))
            .catch((response) => dispatch({
                type: UPDATE_PROFILE_IMAGE,
                payload: ''
            }))
    }
};

export const updateUserProfile = (me) => {
    const storeProfileData = (data) => {
        if (data.status === 1) {
            return {
                type: UPDATE_PROFILE,
                payload: data.values[0]
            }
        } else {
            return {
                type: UPDATE_PROFILE,
                payload: {}
            }
        }
    };
    return dispatch => {
        dispatch({ type: INIT_REQUEST });
        dispatch({ type: RESET_RESPONSE });

        ProfileService.updateProfile(me)
            .then((response) => {
                // console.log(response);
                dispatch(storeProfileData(response));
                dispatch({
                    type: OPEN_DIALOG,
                    payload: { open: true, title: 'Update Profile', description: response.values }
                });
            }).catch((response) => {
                // console.log(response);
                dispatch({
                    type: STORE_USER,
                    payload: response
                })
            })
    }
};
