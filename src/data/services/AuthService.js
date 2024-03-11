// data/network/AuthService.js

import { stringify } from "qs";

import { DeviceInfoService } from "./DeviceInfoService";
import { getAuthHeaders, getHeaders, URL_LOGIN, URL_LOGOUT } from "../../common/APIUtils";
import axiosStack from "../network/axiosStack";

const login = (email, password) => {

  const args = DeviceInfoService.getDeviceArgs();
  args['username'] = email;
  args['password'] = password;

  return axiosStack({
    url: URL_LOGIN,
    method: "POST",
    data: stringify(args),
    headers: getHeaders()
  });
};

const logout = () => {
  return axiosStack({
    url: URL_LOGOUT,
    method: "POST",
    headers: getAuthHeaders()
  });
};

export const AuthService = {
  login,
  logout
};
