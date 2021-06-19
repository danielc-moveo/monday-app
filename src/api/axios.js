import axios from "axios";

const setAuthTokenAndContentType = (axiosInstance, token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = token;
  }
};

const axiosInstance = axios.create({
  headers: { "Content-Type": "multipart/form-data" },
});

setAuthTokenAndContentType(axiosInstance, process.env.REACT_APP_API_TOKEN);

export default axiosInstance;
