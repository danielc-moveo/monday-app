import React, { useEffect, useState } from "react";
import "../App.css";
import useRecorder from "./useRecorder";
import { useCallback } from "react";
import { StartRecording } from "./StartRecording";
import { RecordingPlayer } from "./RecordingPlayer";
import { WelcomeHeader } from "./WelcomeHeader";
import styled from "styled-components";
import { FlexedColCenter } from "../ui/Layouts";
import { sendVoiceMessage } from "../utils/add-voice";
import { getContext, getVoiceMessagesHistory } from "../utils/on-load";
import MessagesHistory from "./MessagesHistory";

const Container = styled.div`
  text-align: center;
  margin: 49px auto 32px auto;
  height: ${({ hasHistory }) => (hasHistory ? "198px" : "auto")};
  border-bottom: ${({ hasHistory }) => (hasHistory && "1px solid #E6E9EF")};
  width:100%;
`;
const Wrapper = styled(FlexedColCenter)`
width:100%;
`;

const FeatureManager = ({ mondayInstance }) => {
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

  const hasHistory = messagesHistory.length > 0;
  return (
    <Wrapper>
      <Container hasHistory={hasHistory}>
        {!hasHistory && <WelcomeHeader />}
        {!isRecording && !blob ? (
          <StartRecording
            startRecord={startRecord}
            hasHistory={messagesHistory.length > 0}
          />
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

      {messagesHistory.length > 0 && (
        <MessagesHistory messagesHistory={messagesHistory} />
      )}
    </Wrapper>
  );
};

export default FeatureManager;
