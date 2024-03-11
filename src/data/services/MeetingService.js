// data/network/services/MeetingService.js

import axiosStack from '../network/axiosStack';
import {
    getAuthHeaders, URL_ADD_MEETING, URL_DELETE_MEETING, URL_GET_MEETINGS, URL_GET_MEETING_DETAILS,
    URL_UPDATE_MEETING,
    URL_UPDATE_MEETING_STATUS
} from '../../common/APIUtils';
import { stringify } from "qs";
import moment from 'moment';

/**
 * Get user's all meetings 
 */
const getMeetings = () => {
    return axiosStack({
        url: URL_GET_MEETINGS,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

/**
 * Get particular meeting details 
 * @param {id} meeting_id 
 */
const getMeetingDetails = (meeting_id) => {
    let mUrl = URL_GET_MEETING_DETAILS + meeting_id;
    return axiosStack({
        url: mUrl,
        method: 'GET',
        headers: getAuthHeaders()
    })
}

/**
 * Delete a particular meeting. User can delete his/her own created meeting only. 
 * @param {id} meeting_id 
 */
const deleteMeeting = (meeting_id) => {
    const meeting = {
        meeting_id: meeting_id
    }
    return axiosStack({
        url: URL_DELETE_MEETING,
        method: 'POST',
        data: stringify(meeting),
        headers: getAuthHeaders()
    })
}

/**
 * Add a meeting
 * @param {Meeging Object} meeting 
 */
const addMeeting = (meeting) => {
    let mUtcTime = moment(meeting.start_time).utc().format("YYYY-MM-DD HH:mm:ss");
    meeting['start_time'] = mUtcTime;
    return axiosStack({
        url: URL_ADD_MEETING,
        method: 'POST',
        data: stringify(meeting),
        headers: getAuthHeaders()
    })
}

/**
 * Update a meeting
 * @param {Meeging Object} meeting 
 */
const updateMeeting = (meeting) => {
    let mUtcTime = moment(meeting.start_time).utc().format("YYYY-MM-DD HH:mm:ss");
    meeting['start_time'] = mUtcTime;
    return axiosStack({
        url: URL_UPDATE_MEETING,
        method: 'POST',
        data: stringify(meeting),
        headers: getAuthHeaders()
    })
}

/**
 * Update a meeting status 
 * @param {id} meeting_id 
 * @param {status enum} status // It can be YES/NO/MAYBE
 */
const updateMeetingStatus = (meeting_id, status) => {
    const meeting = {
        meeting_id: meeting_id,
        status: status
    }
    return axiosStack({
        url: URL_UPDATE_MEETING_STATUS,
        method: 'POST',
        data: stringify(meeting),
        headers: getAuthHeaders()
    })
}


export const MeetingService = {
    addMeeting, updateMeeting, deleteMeeting, getMeetings, getMeetingDetails, updateMeetingStatus
}