import React, { useCallback, useRef, useState } from "react";
import { Colors } from "../ui/Colors";
import styled from "styled-components";
import { IconBtn } from "../ui/Layouts";
import { ReactComponent as TrashIcon } from "../ui/icons/Trash.svg";
import { ReactComponent as RecordIcon } from "../ui/icons/Record.svg";
import { ReactComponent as PlayIcon } from "../ui/icons/Play.svg";
import { ReactComponent as PauseIcon } from "../ui/icons/Pause.svg";
import { RecordTitleInput } from "./RecordTitleInput";

const PlayerContainer = styled.div`
  background-color: ${Colors.lightGrey};
  width: 70%;
  height: 65px;
  border-radius: 50px;
  display: flex;
  justify-content: space-between;
`;
const AudioContainer = styled.div`
  display: none;
`;

export const RecordingPlayer = ({
  stopRecord,
  deleteRecord,
  isRecording,
  src,
  blob,
}) => {
  const [isReplay, setIsReplay] = useState(false);
  const audioRef = useRef(null);

  const play = useCallback(() => {
    audioRef.current.play();
    setIsReplay(true);
  }, [audioRef]);
  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsReplay(false);
  }, [audioRef]);

  return (
    <>
      <AudioContainer>
        <audio src={src} controls ref={audioRef} />
      </AudioContainer>
      <PlayerContainer>
        <IconBtn onClick={deleteRecord}>
          <TrashIcon />
        </IconBtn>
        {isRecording ? (
          <IconBtn onClick={stopRecord}>
            <RecordIcon />
          </IconBtn>
        ) : !isReplay ? (
          <IconBtn onClick={play}>
            <PlayIcon />
          </IconBtn>
        ) : (
          <IconBtn onClick={pause}>
            <PauseIcon />
          </IconBtn>
        )}
      </PlayerContainer>
      {!isRecording ? <RecordTitleInput /> : null}
    </>
  );
};
