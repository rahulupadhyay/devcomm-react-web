// data/network/DeviceInfo.js

import axiosStack from "../network/axiosStack";
import {
  getAuthHeaders,
  URL_UPDATE_DEVICE_INFO,
  URL_GET_DEVICES,
  URL_DELETE_DEVICE
} from "../../common/APIUtils";
import { stringify } from "qs";
import { getDeviceInfo } from "../../common/getDeviceInfo";
import { getFCMToken, getUserId } from "../storage/ProfileHelper";
import { getUUID } from "../storage/DeviceHelper";
import packageJson from "../../../package.json";

const getDeviceArgs = () => {
  // console.debug('version', packageJson.version);
  let versionName = packageJson.version;
  let versionCode = packageJson.versionCode;
  let appVersion = versionName + "+" + versionCode;
  // console.debug('version', appVersion);
  let deviceInfo = getDeviceInfo();
  let mDate = new Date();
  let mOffSet = mDate.getTimezoneOffset() * 60 * 1000 * -1;
  return {
    device_id: getUUID(),
    app_version: appVersion,
    dev_mode: false,
    dev_platform: "web",
    dev_platform_type: "ReactJS",
    device_hardware: deviceInfo.os.name + " " + deviceInfo.os.version,
    device_software: deviceInfo.browser.name + "+" + deviceInfo.browser.version,
    timezone_offset: mOffSet,
    fcm_token: getFCMToken()
  }
}

/**
 * Update Device Info. This is useful when we get new FCM Token or any changes 
 */
const updateDeviceInfo = (props) => {
  // console.debug('updateDeviceInfo', 'new call');
  return axiosStack(props, {
    url: URL_UPDATE_DEVICE_INFO,
    method: "POST",
    data: stringify(getDeviceArgs()),
    headers: getAuthHeaders()
  })
}

const getUserDevices = () => {
  let _mUrl = URL_GET_DEVICES + '&user_id=' + getUserId();
  return axiosStack({
    url: _mUrl,
    method: "GET",
    headers: getAuthHeaders()
  })
}

const signOutFromDevice = (deviceId) => {
  let _id = {
    id: deviceId
  }
  return axiosStack({
    url: URL_DELETE_DEVICE,
    method: "POST",
    data: stringify(_id),
    headers: getAuthHeaders()
  })

}

export const DeviceInfoService = {
  getDeviceArgs,
  updateDeviceInfo,
  getUserDevices,
  signOutFromDevice
};
