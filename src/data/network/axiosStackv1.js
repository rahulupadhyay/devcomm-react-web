// data/network/axiosStack.js
// Read: https://gist.github.com/sheharyarn/7f43ef98c5363a34652e60259370d2cb
import axios from "axios";
// Live
const PRODUCTION_URL = "https://devtracker.devdigital.com/index.php";

// Staging
const DEVELOPMENT_URL = "http://10.30.16.7/index.php";
// const DEVELOPMENT_URL = "http://10.30.17.229/index.php";

// Local
export const BASE_URL =
  process.env.NODE_ENV === "development" ? DEVELOPMENT_URL : PRODUCTION_URL;

const client = axios.create({
  baseURL: BASE_URL
});

const axiosStackv1 = async options => {
  // console.debug("Optios:", options);
  const onSuccess = response => {
    // console.debug("Request Successful!", response);
    return response.data;
  };

  const onError = error => {
    // console.error("Request Failed:", error.config);
    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      // console.error("Status:", error.response.status);
      // console.error("Data:", error.response.data);
      // console.error("Headers:", error.response.headers);
      if (error.response.status === 401) {
        // TODO logout user, clear memory and change user state to unauthorize
      }
    } else {
      // Something else happened while setting up the request
      // triggered the error
      // console.error("Error Message:", error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default axiosStackv1;
