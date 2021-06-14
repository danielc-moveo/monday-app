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
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./ui/Theme";

const Container = styled(FlexedColCenter)`
  background: ${({ theme }) => theme.background};
  height: 100%;
  width: 100%;
  justify-content: center;
`;
const Wrapper = styled(FlexedColCenter)``;

const AppSolution = ({ mondayInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [theme, setTheme] = useState("");

  const [error, setError] = useState(null);

  // let [audioURL, isRecording, startRecording, stopRecording, blob, setBlob] =
  //   useRecorder();

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

  return (
    <ThemeProvider theme={themeMode}>
      <Container>
        <Wrapper>
          <Header />
          <RecordingPlayer handleAdd={handleAdd} />
        </Wrapper>

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
      </Container>
    </ThemeProvider>
  );
};

export default AppSolution;
