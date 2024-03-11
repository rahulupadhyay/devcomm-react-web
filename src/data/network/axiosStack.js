// data/network/axiosStack.js
// Read: https://gist.github.com/sheharyarn/7f43ef98c5363a34652e60259370d2cb
import axios from "axios";
import * as AxiosLogger from "axios-logger";

import { BASE_URL } from "../../common/APIUtils";
import { setAuthToken, setLoggedIn } from "../storage";

const client = axios.create({
  baseURL: BASE_URL,
});
console.log("BASE_URL", BASE_URL);
client.interceptors.request.use((request) => {
  return AxiosLogger.requestLogger(request, {
    url: true,
    headers: true,
  });
});
client.interceptors.response.use(AxiosLogger.responseLogger);

const axiosStack = async (options) => {
  // console.debug('Optios:', options);
  const onSuccess = (response) => {
    // console.debug('Request Successful!', response);
    //logger.debug(response);
    return response.data;
  };

  const onError = (error) => {
    // console.error('Request Failed:', error.config);
    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      let _status = error.response.status;
      let _data = error.response.data;
      let _headers = error.response.headers;

      //logger.error(_status + "," + _data + "," + _headers);
      switch (error.response.status) {
        case 401:
          // TODO logout user, clear memory and change user state to unauthorize
          setLoggedIn(false);
          setAuthToken(null);
          break;
        default:
          console.error(_headers);
          break;
      }
    } else {
      // Something else happened while setting up the request
      // triggered the error
      // console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

// const logout = () => {
//     return <Redirect to='/login' />
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         unautorizeUser: (email, password) => dispatch(unautorize())
//     };
// };

export default axiosStack;
