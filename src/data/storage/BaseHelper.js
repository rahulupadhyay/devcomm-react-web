import { UUID } from "./DeviceHelper";


export const storeData = (key, value, forSession = false) => {
    forSession ? sessionStorage.setItem(key, value) : localStorage.setItem(key, value);
};

export const getData = (key, fromSession = false) => {
    return fromSession ? sessionStorage.getItem(key) : localStorage.getItem(key);
};

export const clearData = () => {
    let mUUID = getData(UUID);
    localStorage.clear();
    storeData('uuid', mUUID);
    sessionStorage.clear();
};