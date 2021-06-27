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
import { sendVoiceMessage } from '../api/monday/utils/add-message';
import { getContext, getVoiceMessagesHistory } from '../api/monday/utils/load-messages';

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

const LoaderContainer = styled.div`
  position: absolute;
  top: 112px;
`;

const FeatureManager = ({ mondayUserInstance }) => {
  const [currentItemId, setCurrentItemId] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesFetched, setIsMessagesFetched] = useState(false);
  const [theme, setTheme] = useState('');
  const [userId, setUserId] = useState(null);

  const sendMessage = useCallback(
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
        mondayUserInstance.execute('notice', {
          message: 'Voice Message Uploaded Successfully',
          type: 'success',
          timeout: 6000,
        });
        setMessagesHistory((prev) => [{ ...processedResponse }, ...prev]);
        setIsLoading(false);
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
          <>
            <Container hasHistory={hasHistory}>
              <Wrapper>
                <RecordingPlayer sendMessage={sendMessage} hasHistory={hasHistory} />
              </Wrapper>
              {isLoading && (
                <LoaderContainer>
                  <Loader />
                </LoaderContainer>
              )}
            </Container>

            {messagesHistory.length > 0 && (
              <MessagesHistory
                mondayUserInstance={mondayUserInstance}
                messagesHistory={messagesHistory}
                setMessagesHistory={setMessagesHistory}
                userId={userId}
              />
            )}
          </>
        </FeatureWrapper>
      )}
    </ThemeProvider>
  );
};

export default FeatureManager;
