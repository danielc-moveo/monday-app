import React from "react";
import { Colors } from "../ui/Colors";
import {
  Header1,
  Header2,
  Header3,
  FlexedColCenter,
  IconBtn,
} from "../ui/Layouts";
import styled from "styled-components";
import { ReactComponent as MicIcon } from "../ui/icons/Mic.svg";

const ActionText = styled(Header3)`
  color: ${Colors.grey};
`;

export const StartRecording = ({ startRecord, hasHistory }) => {
  return (
    <>
      <IconBtn onClick={startRecord}>
        <MicIcon />
      </IconBtn>

      <ActionText>{`${
        hasHistory ? "Record new Voice Description" : "Start recording now"
      } `}</ActionText>
    </>
  );
};
