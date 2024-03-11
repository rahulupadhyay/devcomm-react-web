// data/network/AuthService.js

import { stringify } from "qs";

import { getAuthHeaders, URL_UPDATE_PASSWORD, URL_UPDATE_PROFILE, URL_UPDATE_PROFILE_PIC } from '../../common/APIUtils';
import axiosStack from '../network/axiosStack';

const updateProfileImage = (imgFile) => {
    let formData = new FormData();
    formData.append("profile_pic", imgFile);

    return axiosStack({
        url: URL_UPDATE_PROFILE_PIC,
        method: 'POST',
        data: formData,
        headers: getAuthHeaders('multipart/form-data')
    })
}

const updateProfile = (me) => {
    return axiosStack({
        url: URL_UPDATE_PROFILE,
        method: 'POST',
        data: stringify(me),
        headers: getAuthHeaders()
    })
}

/**
 * Method to update Password of logged in user
 * @param {String} oldPassword Existing password
 * @param {String} newPassword New password
 */
const updatePassword = (oldPassword, newPassword) => {
    let profile = {
        current_password: oldPassword,
        new_password: newPassword
    }
    return axiosStack({
        url: URL_UPDATE_PASSWORD,
        method: 'POST',
        data: stringify(profile),
        headers: getAuthHeaders()
    })
}

export const ProfileService = {
    updateProfile, updateProfileImage, updatePassword
}