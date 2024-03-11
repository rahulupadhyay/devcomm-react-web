import { getData, storeData } from "./BaseHelper";

export const storeNotification = (message) => {
    if (getData('notifications') === null) {
        let notifications = [];
        notifications.push(message);
        storeData('notifications', JSON.stringify(notifications));
    } else {
        let allNotifications = JSON.parse(getData('notifications'));
        allNotifications.push(message);
        storeData('notifications', JSON.stringify(allNotifications));
    }

}

export const getNotifications = () => {
    return JSON.parse(getData('notifications'));
}

export const clearAllNotifications = () => {
    localStorage.removeItem('notifications');
}