import { storeData, getData } from "./BaseHelper";

export const setLoggedIn = (value) => {
    // console.log(value);
    storeData("isLoggedIn", value);
};

export const isLoggedIn = () => {
    return getData("isLoggedIn");
};

export const getUserId = () => {
    return getData("user_id");
};
export const setUserId = (userId) => {
    storeData("user_id", userId);
};
export const setFCMToken = (fcmToken) => {
    storeData("fcm_token", fcmToken);
    // console.debug('fcm', 'token stored');
}

export const getFCMToken = () => {
    return getData("fcm_token");
}
export const setUserData = (value) => {
    storeData("user_data", value);
};
export const getUserData = () => {
    return getData("user_data");
};

export const setUserImage = (user_image) => {
    storeData("user_image", user_image);
};

export const setAuthToken = (auth_token) => {
    storeData("auth_token", auth_token);
};

export const getAuthToken = () => {
    return getData("auth_token");
};

export const getUserImage = () => {
    return getData("user_image");
};

export const getUserName = () => {
    return getData("first_name") + " " + getData("last_name");
};