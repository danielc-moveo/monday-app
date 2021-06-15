import React, { useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../ui/Colors";
import styled from "styled-components";
import { IconBtn } from "../ui/Layouts";
import { ReactComponent as TrashIcon } from "../ui/icons/Trash.svg";
import { ReactComponent as RecordIcon } from "../ui/icons/Record.svg";
import { ReactComponent as PlayIcon } from "../ui/icons/Play.svg";
import { ReactComponent as PauseIcon } from "../ui/icons/Pause.svg";
import { RecordTitleInput } from "./RecordTitleInput";
import { PlayOrPause } from "./PlayOrPause";
import useRecorder from "./useRecorder";
import { StartRecording } from "./StartRecording";
import getBlobDuration from "get-blob-duration";
import { Timers } from "./Timer";

const PlayerContainer = styled.div`
  background-color: ${Colors.lightGrey};
  width: 70%;
  height: 65px;
  border-radius: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AudioContainer = styled.div`
  display: none;
`;
const StopBtn = styled(IconBtn)``;

export const RecordingPlayer = ({ handleAdd }) => {
  const audioRef = useRef(null);
  const [blobDuration, setBlobDuration] = useState(0);
  const [isReplay, setIsReplay] = useState(false);

  let [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    blob,
    setBlob,
    setAudioURL,
  ] = useRecorder();

  const startRecord = () => {
    startRecording();
  };

  const deleteRecord = () => {
    stopRecording();
    setAudioURL("");
    setBlobDuration(0);
    setBlob(null);
  };

  const play = useCallback(() => {
    audioRef.current.play();
    document.getElementById("leftTimerBtnPlay").click();
  }, [audioRef]);

  const pause = useCallback(() => {
    audioRef.current.pause();
    document.getElementById("leftTimerBtnPause").click();
  }, [audioRef]);

  const stop = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  const handleTimeout = () => {
    document.getElementById("leftTimerBtnReset").click();
    document.getElementById("leftTimerBtnStop").click();
    setIsReplay(false);
  };

  useEffect(() => {
    const fetchDuration = async () => {
      const duration = await getBlobDuration(audioURL);
      setBlobDuration(duration);
    };
    if (blob && audioURL) fetchDuration();
  }, [blob, audioURL]);

  return (
    <>
      <AudioContainer>
        <audio src={audioURL} controls ref={audioRef} type="audio/mp4" />
      </AudioContainer>

      {!isRecording && !blob ? (
        <StartRecording startRecord={startRecord} />
      ) : (
        <PlayerContainer>
          <IconBtn onClick={deleteRecord}>{blob && <TrashIcon />}</IconBtn>

          {(blobDuration > 0 || isRecording) && (
            <Timers
              blobDuration={blobDuration}
              isRecording={isRecording}
              handleTimeout={handleTimeout}
            />
          )}

          {isRecording ? (
            <StopBtn onClick={stop}>
              <RecordIcon />
            </StopBtn>
          ) : (
            <PlayOrPause
              play={play}
              pause={pause}
              isReplay={isReplay}
              setIsReplay={setIsReplay}
            />
          )}
        </PlayerContainer>
      )}

      {!isRecording && blob ? (
        <RecordTitleInput handleAdd={handleAdd} blob={blob} />
      ) : null}
    </>
  );
};
