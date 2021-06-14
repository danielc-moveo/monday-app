import React, { useEffect, useState } from "react";
import "./App.css";
import "react-voice-recorder/dist/index.css";
import useRecorder from "./components/useRecorder";
import { useCallback } from "react";
import { sendVoiceMessage } from "./utils/add-voice";
import { getCurrentItemID, getVoiceMessagesHistory } from "./utils/on-load";
import { MainScreen } from "./components/MainScreen";

const AppSolution = ({ mondayInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState(null);
  const [error, setError] = useState(null);

  let [audioURL, isRecording, startRecording, stopRecording, blob] =
    useRecorder();

  const handleAdd = useCallback(
    async (blob) => {
      const params = {
        mondayInstance,
        blob,
        currentItemId,
        messageNumber: messagesHistory.length() + 1,
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

  return (
    <div
      style={{ display: "flex", justifyContent: "space-around", width: "100%" }}
    >
      {error && <div>{error}</div>}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <MainScreen />
        <audio src={audioURL} controls />
        <button onClick={startRecording} disabled={isRecording}>
          start recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          stop recording
        </button>
      </div>
      <div>
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
    </div>
  );
};

export default AppSolution;
