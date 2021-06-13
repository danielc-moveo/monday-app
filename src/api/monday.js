import mondaySdk from "monday-sdk-js";

export const mondayInstance = mondaySdk({
  clientId: process.env.REACT_APP_CLIENT_ID,
  apiToken: process.env.REACT_APP_API_TOKEN,
});
