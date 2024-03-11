//getCalendarData
import moment from 'moment';

import { getAuthHeaders, URL_GET_CALENDAR, URL_HOLIDAYS } from '../../common/APIUtils';
import axiosStack from '../network/axiosStack';

/**
 * Get current year's calendar items
 */
const getCalendarData = () => {
    let mUrl = URL_GET_CALENDAR + '&start_date=' + moment().startOf('year').format("YYYY-MM-DD")
        + '&end_date=' + moment().endOf('year').format("YYYY-MM-DD");
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

/**
 * Get today's calendar entries 
 */
const getTodaysCalendar = () => {
    let mUrl = URL_GET_CALENDAR + '&start_date=' + moment().format("YYYY-MM-DD")
        + '&end_date=' + moment().format("YYYY-MM-DD");
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

/**
 * Method to get holidays list
 * @param {string} year Optional paramter. Default Value: curent year.
 */
const getHolidays = (year = new Date().getFullYear()) => {
    let mUrl = URL_HOLIDAYS + year;
    return axiosStack({
        url: mUrl,
        method: "GET",
        headers: getAuthHeaders()
    });
};

export const CalendarService = {
    getCalendarData, getTodaysCalendar, getHolidays
}