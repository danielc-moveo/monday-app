import React, { useEffect, useState } from "react";
import "./App.css";
import "monday-ui-react-core/dist/main.css";
import FeatureManager from "./components/FeatureManager";
import { mondayUserInstance, mondayPrivateInstance } from "./api/monday";
import axios from "axios";

const App = () => {
  // const [isAuthorized, setIsAuthorized] = useState(false);
  //https://c8b30cd05ba1.ngrok.io
  //https://auth.monday.com/oauth2/authorize?client_id=4e35caa6c69460ae555a974852334926
  // useEffect(() => {
  //   // debugger
  //   // const res = axios.get("https://auth.monday.com/oauth2/authorize?client_id=4e35caa6c69460ae555a974852334926").then((res)=>{
  //   //   debugger
  //   // }).catch((err)=>{
  //   //   debugger
  //   // });
  //   debugger;
  //   if (!isAuthorized) {
  //     mondayUserInstance.oauth({
  //       clientId: process.env.REACT_APP_CLIENT_ID,
  //     });
  //     setIsAuthorized(true);
  //   }
  // }, [isAuthorized]);

  return (
    <div className="App">
      <FeatureManager mondayUserInstance={mondayUserInstance} />
    </div>
  );
};

export default App;
