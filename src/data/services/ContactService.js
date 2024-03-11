import axiosStack from '../network/axiosStack';
import { getAuthHeaders, URL_CONTACTS, URL_CONTACT_BY_ID, URL_SKILLS_BY_ID, URL_DASHBOARD } from '../../common/APIUtils';
import moment from 'moment';

/**
 * Method to get all contacts
 */
const getContacts = () => {
    return axiosStack({
        url: URL_CONTACTS,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

/**
 * Method to get individual contact details
 * @param {user_id} userId 
 */
const getContact = (userId) => {
    let mUrl = URL_CONTACT_BY_ID + userId;
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

/**
 * Method to get contact's skills/experties 
 */
const getSkills = (userId) => {
    let mUrl = URL_SKILLS_BY_ID + userId;
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

/**
 * Method to get dashboard items. 
 */
const getDashboard = () => {
    let mUrl = URL_DASHBOARD + '&date=' + moment().format('YYYY-MM-DD');
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

export const ContactService = {
    getContact, getContacts, getSkills, getDashboard
}