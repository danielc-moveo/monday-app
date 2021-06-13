import React from "react";
import { Colors } from "../ui/Colors";
import styled from "styled-components";

const PlayerContainer = styled.div`
  background-color: ${Colors.lightGrey};
  width: 50%;
  height: 65px;
  border-radius: 50px;
`;
export const RecordingPlayer = ({ stopRecord, deleteRecord, src }) => {
  return (
    <PlayerContainer>
      <audio src={src} controls />
      <button onClick={deleteRecord}>trash icon</button>
      <button onClick={stopRecord}>stop icon</button>
    </PlayerContainer>
  );
};
