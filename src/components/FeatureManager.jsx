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
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../ui/Theme";
import MessagesHistory from "./MessagesHistory";

const Container = styled(FlexedColCenter)`
  background: ${({ theme }) => theme.background};
  text-align: center;
  margin: 49px auto 32px auto;
  height: ${({ hasHistory }) => (hasHistory ? "198px" : "auto")};
  border-bottom: ${({ hasHistory }) => hasHistory && "1px solid #E6E9EF"};
  width: 100%;
  justify-content: center;
`;

const Wrapper = styled(FlexedColCenter)`
  width: 40%;
`;

const FeatureManager = ({ mondayInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [theme, setTheme] = useState("");
  const [error, setError] = useState(null);

  const handleAdd = useCallback(
    async (title, blob) => {
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
    [currentItemId, mondayInstance, messagesHistory]
  );

  useEffect(() => {
    const fetchData = async () => {
      const { itemIdResponse, theme } = await getContext(mondayInstance);
      setTheme(theme);
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

  const themeMode = theme === "light" ? lightTheme : darkTheme;

  const hasHistory = messagesHistory.length > 0;
  return (
    <ThemeProvider theme={themeMode}>
      <Container hasHistory={hasHistory}>
        <Wrapper>
          {!hasHistory && <WelcomeHeader />}
          <RecordingPlayer handleAdd={handleAdd} />
        </Wrapper>

        {messagesHistory.length > 0 && (
          <MessagesHistory messagesHistory={messagesHistory} />
        )}
      </Container>
    </ThemeProvider>

    // <Wrapper>
    //   <Container hasHistory={hasHistory}>
    //     {!hasHistory && <WelcomeHeader />}
    //     {!isRecording && !blob ? (
    //       <StartRecording
    //         startRecord={startRecord}
    //         hasHistory={messagesHistory.length > 0}
    //       />
    //     ) : (
    //       <RecordingPlayer
    //         stopRecord={stopRecord}
    //         deleteRecord={deleteRecord}
    //         isRecording={isRecording}
    //         src={audioURL}
    //         handleAdd={handleAdd}
    //         blob={blob}
    //       />
    //     )}
    //   </Container>

    //   {messagesHistory.length > 0 && (
    //     <MessagesHistory messagesHistory={messagesHistory} />
    //   )}
    // </Wrapper>
  );
};

export default FeatureManager;
