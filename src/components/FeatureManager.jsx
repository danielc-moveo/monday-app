import React, { useEffect, useState } from 'react';
import '../App.css';
import { useCallback } from 'react';
import { RecordingPlayer } from './RecordingPlayer';
import styled from 'styled-components';
import { FlexedColCenter } from '../ui/Layouts';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../ui/Theme';
import MessagesHistory from './MessagesHistory';
import Loader from '../ui/Loader';
import { WelcomeHeader } from './WelcomeHeader';
import { sendVoiceMessage } from '../api/monday/utils/add-message';
import { getContext, getVoiceMessagesHistory } from '../api/monday/utils/load-messages';
import MicrophoneAlert from './MicrophoneAlert';
import useMicrophonePermission from './hooks/useMicrophonePermission';

export const FeatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${({ theme }) => theme.color};
`;

const Container = styled(FlexedColCenter)`
  text-align: center;
  margin: ${({ hasHistory }) => (hasHistory ? '0' : '49px 0 32px 0')};
  min-height: ${({ hasHistory }) => hasHistory && '250px'};
  border-bottom: ${({ hasHistory, theme }) => hasHistory && `1px solid ${theme.borderBottom} `};
  width: 100%;
  justify-content: center;
`;

const Wrapper = styled(FlexedColCenter)``;

const FeatureManager = ({ mondayUserInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesFetched, setIsMessagesFetched] = useState(false);
  const [theme, setTheme] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const notification = useMicrophonePermission();

  const handleAdd = useCallback(
    async (title, blob) => {
      setIsLoading(true);
      const messageNumber = messagesHistory ? messagesHistory.length + 1 : 0;
      const params = {
        mondayUserInstance,
        blob,
        currentItemId,
        messageNumber,
        title,
        userId,
      };
      const { msg, processedResponse } = await sendVoiceMessage(params);
      if (msg === 'success' && processedResponse) {
        setMessagesHistory((prev) => [{ ...processedResponse }, ...prev]);
        setIsLoading(false);
      } else {
        setError(msg);
      }
    },
    [currentItemId, mondayUserInstance, messagesHistory, userId]
  );

  useEffect(() => {
    const fetchData = async () => {
      const { itemIdResponse, theme, id } = await getContext(mondayUserInstance);
      setTheme(theme);
      setUserId(id);
      setCurrentItemId(itemIdResponse);
      const response = await getVoiceMessagesHistory(mondayUserInstance, itemIdResponse);
      const { messagesHistory, msg } = response;
      if (msg === 'success' && messagesHistory) {
        setMessagesHistory([...messagesHistory]);
      }
      setIsLoading(false);
      setIsMessagesFetched(true);
    };
    fetchData();
  }, [mondayUserInstance]);

  useEffect(() => {
    mondayUserInstance.listen(['context'], (res) => {
      const themeResponse = res.data.theme;
      const hasThemeChanged = themeResponse === theme;
      if (!hasThemeChanged) {
        setTheme(themeResponse);
      }
    });
  }, [mondayUserInstance, theme]);

  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  const hasHistory = messagesHistory.length > 0;
  return (
    <ThemeProvider theme={themeMode}>
      {!isMessagesFetched ? (
        <Loader />
      ) : (
        <FeatureWrapper>
          {notification ? (
            <MicrophoneAlert notification={notification} />
          ) : (
            <>
              <Container hasHistory={hasHistory}>
                <Wrapper>
                  {!hasHistory && <WelcomeHeader />}
                  <RecordingPlayer handleAdd={handleAdd} hasHistory={hasHistory} />
                </Wrapper>
              </Container>
              {isLoading ? (
                <Loader />
              ) : (
                messagesHistory.length > 0 && (
                  <MessagesHistory
                    mondayUserInstance={mondayUserInstance}
                    messagesHistory={messagesHistory}
                    setMessagesHistory={setMessagesHistory}
                    userId={userId}
                  />
                )
              )}
            </>
          )}
        </FeatureWrapper>
      )}
    </ThemeProvider>
  );
};

export default FeatureManager;
