import React, { useEffect, useState } from "react";
import "./App.css";
import "react-voice-recorder/dist/index.css";
import useRecorder from "./components/useRecorder";
import { useCallback } from "react";
import { StartRecording } from "./components/StartRecording";
import { RecordingPlayer } from "./components/RecordingPlayer";
import { Header } from "./components/Header";
import styled from "styled-components";
import { FlexedColCenter } from "./ui/Layouts";
import { sendVoiceMessage } from "./utils/add-voice";
import { getCurrentItemID, getVoiceMessagesHistory } from "./utils/on-load";

const Container = styled(FlexedColCenter)``;

const AppSolution = ({ mondayInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState(null);
  const [error, setError] = useState(null);

  let [audioURL, isRecording, startRecording, stopRecording, blob] =
    useRecorder();

  const handleAdd = useCallback(
    async (blob) => {
      const messageNumber = messagesHistory ? messagesHistory.length() + 1 : 0;
      const params = {
        mondayInstance,
        blob,
        currentItemId,
        messageNumber,
        voiceMessageTitle: "a dummy title",
      };
      const response = await sendVoiceMessage(params);
      if (!response.msg === "success") {
        setError(response.msg);
      }
    },
    [currentItemId, mondayInstance, messagesHistory]
  );

  useEffect(() => {
    if (blob) {
      handleAdd(blob);
    }
  }, [blob, handleAdd]);

  useEffect(() => {
    const fetchData = async () => {
      const { itemIdResponse } = await getCurrentItemID(mondayInstance);
      setCurrentItemId(itemIdResponse);
      const messagesHistory = await getVoiceMessagesHistory(
        mondayInstance,
        itemIdResponse
      );
      if (messagesHistory) setMessagesHistory([...messagesHistory]);
    };
    fetchData();
  }, [mondayInstance]);

  const startRecord = () => {
    startRecording();
  };
  const stopRecord = () => {
    stopRecording();
  };
  const deleteRecord = () => {
    stopRecording();
    blob = null;
    debugger;
  };

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
            isRecording={isRecording}
            src={audioURL}
            blob={blob}
          />
        )}
      </Container>

      {messagesHistory &&
        messagesHistory.map((message, i) => (
          <div style={{ marginBottom: "10px" }}>
            <div>
              <div style={{ color: "white", marginBottom: "4px" }}>
                {`${message.creatorName} ${i + 1}`}
              </div>
            </div>
            <div>
              <audio src={message.assetSrc} controls />
            </div>
          </div>
        ))}
    </div>
  );
};

export default AppSolution;
