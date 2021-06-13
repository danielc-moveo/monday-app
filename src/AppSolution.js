import React, { useEffect, useState } from "react";
import "./App.css";
import "react-voice-recorder/dist/index.css";
import mondaySdk from "monday-sdk-js";
// import VideoRecorder from "react-video-recorder";
// import { Recorder } from "react-voice-recorder";
// import AudioReactRecorder, { RecordState } from "audio-react-recorder";
// import Recorder from "react-mp3-recorder";

import useRecorder from "./components/useRecorder";
import axios from "./api";
import { useCallback } from "react";

const monday = mondaySdk({
  clientId: process.env.REACT_APP_CLIENT_ID,
  apiToken: process.env.REACT_APP_API_TOKEN,
});

const AppSolution = () => {
  // constructor(props) {
  //   super(props);

  //   // Default state
  //   this.state = {
  //     recordState: null,

  //     settings: {},
  //     context: {},
  //     name: "",

  //     audioDetails: {
  //       url: null,
  //       blob: null,
  //       chunks: null,
  //       duration: {
  //         h: null,
  //         m: null,
  //         s: null,
  //       },
  //     },
  //   };
  // }

  // const [settings, setSettings] = useState(null);
  const [userName, setUserName] = useState(null);

  let [audioURL, isRecording, startRecording, stopRecording, blob] =
    useRecorder();

  const _handleBlob = useCallback(async (blob) => {
    try {
      const file = _blobToFile(blob, "myFileName");
      const mondaySdkContextResponse = await monday.get("context");
      const { itemId, boardId } = mondaySdkContextResponse.data;
      debugger;
      // const updates = await getUpdates();

      const newUpdateId = await _createUpdate(itemId);
      const newColumnId = await _createColumn(boardId, "Description");
      debugger;

      await _addFileToUpdate(newUpdateId, file);
      await _addFileToColumn(itemId, newColumnId, file);
    } catch (error) {}
  }, []);

  useEffect(() => {
    // monday.listen("settings", (res) => {
    //   setSettings(res.data);
    // });

    const query = ` items {
      name
      updates {
        id
        body
        assets {
          id
          public_url
        }
        
      }
    }`;
    monday
      .api(
        `query { items {
      name
      updates {
        id
        body
        assets {
          id
          public_url
        }
        
      }
    } }`
      )
      .then((res) => {
        debugger
        // setUserName(res.data.me.name);
      });
    if (blob) {
      _handleBlob(blob);
    }
  }, [blob, _handleBlob]);

  // const start = () => {
  //   this.setState({
  //     recordState: RecordState.START,
  //   });
  // };

  // const stop = () => {
  //   this.setState({
  //     recordState: RecordState.STOP,
  //   });
  // };

  //audioData contains blob and blobUrl
  // const onStop = (audioData) => {
  //   console.log("audioData", audioData);
  // };

  // TODO: set up event listeners

  // const _onRecordingComplete = (blob) => {
  //   debugger;
  //   console.log("recording", blob);
  // };

  // const _onRecordingError = (err) => {
  //   debugger;
  //   console.log("recording error", err);
  // };

  const _blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    const newFile = new File([theBlob], fileName, {
      type: theBlob.type,
    });

    return newFile;
  };

  const _createUpdate = async (itemId) => {
    const response = await monday.api(`mutation {
      create_update (item_id: ${itemId}, body: "This update is for a new video") {
      id
      }
      }`);

    const { id } = response.data.create_update;
    return id;
  };

  const _createColumn = async (boardId, columnName) => {
    const response = await monday.api(`mutation {
      create_column (board_id: ${boardId}, title: ${columnName}, column_type: file) {
      id
      }
      }`);
    const { id } = response.data.create_column;
    return id;
  };

  const _addFileToColumn = async (itemId, newColumnId, file) => {
    const formData = new FormData();
    formData.append("variables[file]", file, "filename.webm");

    const noVariableQuery = `mutation addFile($file: File!) {  add_file_to_column (item_id: ${itemId}, column_id: ${newColumnId},file: $file) {id}}`;
    formData.append("query", noVariableQuery);

    try {
      const res = await axios.post(process.env.REACT_APP_BASE_URL, formData);
    } catch (error) {
      //internal 500 server error
    }
  };

  const _addFileToUpdate = async (newUpdateId, file) => {
    const formData = new FormData();
    formData.append("variables[file]", file, "filename.webm");

    const noVariableQuery = `mutation addFile($file: File!) {add_file_to_update (update_id: ${newUpdateId}, file: $file) {id}}`;
    formData.append("query", noVariableQuery);

    try {
      const res = await axios.post(process.env.REACT_APP_BASE_URL, formData);
    } catch (error) {
      //internal 500 server error
    }
  };

  // const handleAudioStop = (data) => {
  //   console.log(data);
  //   this.setState({ audioDetails: data });
  // };
  // const handleAudioUpload = (file) => {
  //   console.log(file);
  // };
  // const handleReset = () => {
  //   const reset = {
  //     url: null,
  //     blob: null,
  //     chunks: null,
  //     duration: {
  //       h: null,
  //       m: null,
  //       s: null,
  //     },
  //   };
  //   this.setState({ audioDetails: reset });
  // };

  return (
    <div className="App">
      {userName && `Hello, ${userName}`}
      {/* <Recorder
          onRecordingComplete={this._onRecordingComplete}
          onRecordingError={this._onRecordingError}
        /> */}
      {/* <VideoRecorder
          onRecordingComplete={(videoBlob) => {
            // Do something with the video...
            this._handleBlob(videoBlob);
          }}
          constraints={{
            video: false,
            audio: true,
          }}
          countdownTime={2000}
          mimeType={"audio/mp4"}
        /> */}
      {/* <Recorder
          record={true}
          title={"New recording"}
          audioURL={this.state.audioDetails.url}
          showUIAudio
          handleAudioStop={(data) => this.handleAudioStop(data)}
          handleOnChange={(value) => this.handleOnChange(value, "firstname")}
          handleAudioUpload={(data) => this._handleBlob(data)}
          handleReset={() => this.handleReset()}
          mimeTypeToUseWhenRecording={"audio/webm"}
        /> */}
      <audio src={audioURL} controls />
      <button onClick={startRecording} disabled={isRecording}>
        start recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        stop recording
      </button>
    </div>
  );
};

export default AppSolution;
