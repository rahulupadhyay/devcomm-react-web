import { storeData, getData } from "./BaseHelper";
export const UUID = 'uuid';

const setUUID = (value) => {
    storeData(UUID, value);
};

export const getUUID = () => {
    if (getData(UUID) === null) {
        let mId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
        setUUID(mId);
        return mId;
    }
    return getData(UUID);
}