import React from "react";
import { Colors } from "../ui/Colors";
import { Header1, Header2, Header3, FlexedColCenter } from "../ui/Layouts";
import styled from "styled-components";

const ActionText = styled(Header3)`
  color: ${Colors.grey};
`;

export const StartRecording = ({ startRecord }) => {
  return (
    <>
      <button onClick={startRecord}>mic icon</button>
      <ActionText>Start recording now</ActionText>
    </>
  );
};
