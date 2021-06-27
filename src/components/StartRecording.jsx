import React, { useState } from 'react';
import { Colors } from '../ui/Colors';
import { Header3, IconBtn } from '../ui/Layouts';
import styled from 'styled-components';
import { ReactComponent as MicIcon } from '../ui/icons/Mic.svg';
import { AlertMessage } from '../ui/alert/alert';

const ActionText = styled(Header3)`
  color: ${Colors.darkGrey};
`;
const IconAndTextWrapper = styled.div`
  position: ${({ hasHistory }) => (hasHistory ? 'absolute' : 'static')};
  left: 0;
  right: 0;
  top: 15%;
`;
const Container = styled.div``;
const AlertWrapper = styled.div`
  position: ${({ hasHistory }) => (hasHistory ? 'relative' : 'static')};
  top: 80%;
`;

export const StartRecording = ({ startRecord, hasHistory }) => {
  const [micBlockAlert, setMicBlockAlert] = useState(false);

  const handleRecord = () => {
    navigator.permissions.query({ name: 'microphone' }).then(function (permissionStatus) {
      if (permissionStatus.state === 'prompt') {
        navigator.mediaDevices.getUserMedia({ audio: true });
      }
      if (permissionStatus.state === 'denied') {
        setMicBlockAlert(true);
      }
      if (permissionStatus.state === 'granted') {
        startRecord();
      }
    });
  };

  return (
    <Container>
      <IconAndTextWrapper hasHistory={hasHistory}>
        <IconBtn onClick={handleRecord} disabled={micBlockAlert}>
          <MicIcon />
        </IconBtn>

        <ActionText>{`${hasHistory ? 'Record a new Voice Description' : 'Start recording now'} `}</ActionText>
      </IconAndTextWrapper>
      <AlertWrapper hasHistory={hasHistory}>{micBlockAlert && <AlertMessage />}</AlertWrapper>
    </Container>
  );
};
