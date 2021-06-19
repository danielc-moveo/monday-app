import React, { useEffect, useState } from "react";
import "../App.css";
import { useCallback } from "react";
import { RecordingPlayer } from "./RecordingPlayer";
import styled from "styled-components";
import { FlexedColCenter } from "../ui/Layouts";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../ui/Theme";
import MessagesHistory from "./MessagesHistory";
import { deleteVmFromDb } from "../api/monday/utils/delete-voice";
import Loader from "../ui/Loader";
import { WelcomeHeader } from "./WelcomeHeader";
import { sendVoiceMessage } from "../api/monday/utils/add-message";
import { getContext, getVoiceMessagesHistory } from "../api/monday/utils/load-messages";

export const FeatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${({ theme }) => theme.color};
`;

const Container = styled(FlexedColCenter)`
  text-align: center;
  margin: ${({ hasHistory }) => (hasHistory ? "0" : "49px 0 32px 0")};
  height: ${({ hasHistory }) => hasHistory && "250px"};
  border-bottom: ${({ hasHistory, theme }) =>
    hasHistory && `1px solid ${theme.borderBottom} `};
  width: 100%;
  justify-content: center;
`;

const Wrapper = styled(FlexedColCenter)``;

const NotificationBox = styled.div`
  margin: 40px auto 0 auto;

  ol {
    margin-top: 60px;
  }
`;

const Notification = styled.div`
  font-weight: bold;
`;
const FeatureManager = ({ mondayUserInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasNewVoiceMessage, setHasNewVoiceMessage] = useState(false);
  const [theme, setTheme] = useState("");
  const [notification, setNotification] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const handleAdd = useCallback(
    async (title, blob) => {
      setHasNewVoiceMessage(true);
      setIsLoading(true);
      const messageNumber = messagesHistory ? messagesHistory.length + 1 : 0;
      const params = {
        mondayUserInstance,
        blob,
        currentItemId,
        messageNumber,
        voiceMessageTitle: title,
        userId,
      };
      const response = await sendVoiceMessage(params);
      setIsLoading(false);
      if (response.msg !== "success") {
        setError(response.msg);
      }
    },
    [currentItemId, mondayUserInstance, messagesHistory, userId]
  );

  useEffect(() => {
    navigator.permissions
      .query({ name: "microphone" })
      .then(function (permissionStatus) {
        if (permissionStatus.state === "denied") {
          setNotification(
            "Please allow microphone access in order to use this feature"
          );
        }

        permissionStatus.onchange = function () {
          console.log("Permission changed to " + this.state);
          if (permissionStatus.state === "denied") {
            setNotification(
              "Please allow microphone access in order to use this feature"
            );
          } else {
            setNotification(null);
          }
        };
      });


    const fetchData = async () => {
      const { itemIdResponse, theme, id } = await getContext(mondayUserInstance);

      setTheme(theme);
      setUserId(id);
      setCurrentItemId(itemIdResponse);
      const response = await getVoiceMessagesHistory(
        mondayUserInstance,
        itemIdResponse
      );
      const { messagesHistory, msg } = response;
      if (msg === "success" && messagesHistory) {
        setMessagesHistory([...messagesHistory]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [mondayUserInstance]);

  useEffect(() => {
    mondayUserInstance.listen(["context"], (res) => {
      const themeResponse = res.data.theme;
      const hasThemeChanged = themeResponse === theme;
      if (!hasThemeChanged) {
        setTheme(themeResponse);
      }
    });
  }, [mondayUserInstance, theme]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getVoiceMessagesHistory(
        mondayUserInstance,
        currentItemId
      );
      const { messagesHistory, msg } = response;
      if (msg === "success" && messagesHistory) {
        setMessagesHistory([...messagesHistory]);
      }
      setIsLoading(false);
    };
    const shouldReoadMessages = hasNewVoiceMessage && isLoading === false;
    if (shouldReoadMessages) {
      fetchData();
      setHasNewVoiceMessage(false);
    }
  }, [hasNewVoiceMessage, currentItemId, mondayUserInstance, isLoading]);

  const themeMode = theme === "light" ? lightTheme : darkTheme;

  const handleDeleteVmFromDb = async (updateId) => {
    setIsDeleting(true);
    const { msg, deletedUpdateId } = await deleteVmFromDb(
      mondayUserInstance,
      updateId
    );
    if (msg === "success") {
      setMessagesHistory((prev) => {
        let newMessagesHistory = [...prev];
        newMessagesHistory = messagesHistory.filter(
          (message) => message.id !== deletedUpdateId
        );
        return newMessagesHistory;
      });
    }
    setIsDeleting(false);
  };

  const hasHistory = messagesHistory.length > 0;
  return (
    <ThemeProvider theme={themeMode}>
      {isLoading ? (
        <Loader />
      ) : (
        <FeatureWrapper>
          {notification ? (
            <NotificationBox>
              <Notification>{notification.toUpperCase()}</Notification>
              <ol>
                <li> Open Chrome.</li>
                <li> At the top right, click More.</li>
                <li> Settings.</li>
                <li> Under "Privacy and security," click Site settings.</li>
                <li> Click Microphone.</li>
                <li> Turn on or off Ask before accessing.</li>
                <li> Refresh the page</li>
              </ol>
            </NotificationBox>
          ) : (
            <>
              <Container hasHistory={hasHistory}>
                <Wrapper>
                  {!hasHistory && <WelcomeHeader />}
                  <RecordingPlayer
                    handleAdd={handleAdd}
                    hasHistory={hasHistory}
                  />
                </Wrapper>
              </Container>
              {messagesHistory.length > 0 && (
                <MessagesHistory
                  isDeleting={isDeleting}
                  messagesHistory={messagesHistory}
                  handleDeleteVmFromDb={handleDeleteVmFromDb}
                  userId={userId}
                  mondayUserInstance={mondayUserInstance}
                />
              )}
            </>
          )}
        </FeatureWrapper>
      )}
    </ThemeProvider>
  );
};

export default FeatureManager;
