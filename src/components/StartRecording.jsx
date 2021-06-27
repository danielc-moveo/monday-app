import React from 'react';
import { Colors } from '../ui/Colors';
import { Header3, IconBtn } from '../ui/Layouts';
import styled from 'styled-components';
import { ReactComponent as MicIcon } from '../ui/icons/Mic.svg';
import { ReactComponent as MicDenied } from '../ui/icons/MicDenied.svg';

const ActionText = styled(Header3)`
  color: ${Colors.darkGrey};
`;

export const StartRecording = ({ startRecord, hasHistory, isMicrophoneAllowed }) => {
  return (
    <>
      {isMicrophoneAllowed ? (
        <>
          <IconBtn onClick={startRecord}>
            <MicIcon />
          </IconBtn>
          <ActionText>{`${hasHistory ? 'Record new Voice Description' : 'Start recording now'} `}</ActionText>
        </>
      ) : (
        <IconBtn>
          <MicDenied />
        </IconBtn>
      )}
    </>
  );
};
