import React from 'react';
import styled from 'styled-components';

const NotificationBox = styled.div`
  margin: 40px auto 0 auto;

  ol {
    margin-top: 60px;
  }
`;

const Notification = styled.div`
  font-weight: bold;
`;

const MicrophoneAlert = ({ notification }) => {
  return (
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
  );
};

export default MicrophoneAlert;
