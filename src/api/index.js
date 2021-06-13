import axios from "axios";

const apiToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjExMzE4NzU1NywidWlkIjoyMjYwNDQ1MCwiaWFkIjoiMjAyMS0wNi0xMFQxMDowNTo1MS44NzdaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6OTE5NjAxNCwicmduIjoidXNlMSJ9.MIJ6sN_Rqnfkpfkl51eBCBQMgx_RPNvBGRXMlmTrUKs";

const setAuthTokenAndContentType = (axiosInstance, token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = token;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const axiosInstance = axios.create({
  headers: { "Content-Type": "multipart/form-data" },
});

setAuthTokenAndContentType(axiosInstance, apiToken);

export default axiosInstance;
