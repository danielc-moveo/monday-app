import React, { useEffect, useState } from "react";
import "./App.css";
import useRecorder from "./components/useRecorder";
import { useCallback } from "react";
import { StartRecording } from "./components/StartRecording";
import { RecordingPlayer } from "./components/RecordingPlayer";
import { Header } from "./components/Header";
import styled from "styled-components";
import { FlexedColCenter } from "./ui/Layouts";
import { sendVoiceMessage } from "./utils/add-voice";
import { getContext, getVoiceMessagesHistory } from "./utils/on-load";

const Container = styled(FlexedColCenter)``;

const AppSolution = ({ mondayInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState([]);

  const [error, setError] = useState(null);

  let [audioURL, isRecording, startRecording, stopRecording, blob, setBlob] =
    useRecorder();

  const handleAdd = useCallback(
    async (title) => {
      const messageNumber = messagesHistory ? messagesHistory.length + 1 : 0;
      const params = {
        mondayInstance,
        blob,
        currentItemId,
        messageNumber,
        voiceMessageTitle: title,
      };
      const response = await sendVoiceMessage(params);
      if (response.msg !== "success") {
        setError(response.msg);
      }
    },
    [currentItemId, mondayInstance, messagesHistory, blob]
  );

  useEffect(() => {
    const fetchData = async () => {
      const { itemIdResponse, theme } = await getContext(mondayInstance);
      setCurrentItemId(itemIdResponse);
      const response = await getVoiceMessagesHistory(
        mondayInstance,
        itemIdResponse
      );
      const { messagesHistory, msg } = response;
      if (msg === "success" && messagesHistory) {
        debugger;
        setMessagesHistory([...messagesHistory]);
      }
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
    setBlob(null);
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
            handleAdd={handleAdd}
            blob={blob}
          />
        )}
      </Container>

      {messagesHistory.length > 0 &&
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
