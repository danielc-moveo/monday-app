import React, { useEffect, useState } from "react";
import "./App.css";
import "react-voice-recorder/dist/index.css";
import useRecorder from "./components/useRecorder";
import { useCallback } from "react";
import { _blobToFile, _createUpdate, _addFileToUpdate } from "./utils/helper";
import { mondayInstance } from "./api/monday";
import { StartRecording } from "./components/StartRecording";
import { RecordingPlayer } from "./components/RecordingPlayer";
import { Header } from "./components/Header";
import styled from "styled-components";
import { FlexedColCenter } from "./ui/Layouts";

const Container = styled(FlexedColCenter)``;

const AppSolution = () => {
  // const [settings, setSettings] = useState(null);
  const [userName, setUserName] = useState(null);

  let [audioURL, isRecording, startRecording, stopRecording, blob] =
    useRecorder();

  const _handleBlob = useCallback(async (blob) => {
    try {
      const file = _blobToFile(blob, "myFileName");
      const mondayContextResponse = await mondayInstance.get("context");
      const { itemId, boardId } = mondayContextResponse.data;
      // const updates = await getUpdates();

      const newUpdateId = await _createUpdate(itemId);
      // const newColumnId = await _createColumn(boardId, "Description");

      await _addFileToUpdate(newUpdateId, file);
      // await _addFileToColumn(itemId, newColumnId, file);
    } catch (error) {}
  }, []);

  useEffect(() => {
    // mondayInstance.listen("settings", (res) => {
    //   setSettings(res.data);
    // });

    if (blob) {
      _handleBlob(blob);
    }
  }, [blob, _handleBlob]);

  const startRecord = () => {
    startRecording();
  };
  const stopRecord = () => {
    stopRecording();
  };
  const deleteRecord = () => {};

  return (
    <div className="App">
      <Container>
        <Header />
        {!isRecording && !blob ? (
          <StartRecording startRecord={startRecord} />
        ) : (
          <RecordingPlayer
            stopRecord={stopRecord}
            deleteRecord={deleteRecord}
            src={audioURL}
          />
        )}

        {/* {userName && `Hello, ${userName}`}
      <audio src={audioURL} controls />
      <button onClick={startRecording} disabled={isRecording}>
        start recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        stop recording
      </button> */}
      </Container>
    </div>
  );
};

export default AppSolution;
