import React, { useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../ui/Colors";
import styled from "styled-components";
import { IconBtn, Header1 } from "../ui/Layouts";
import { ReactComponent as TrashIcon } from "../ui/icons/Trash.svg";
import { ReactComponent as RecordIcon } from "../ui/icons/Record.svg";
import { RecordTitleInput } from "./RecordTitleInput";
import { PlayOrPause } from "./PlayOrPause";
import useRecorder from "./useRecorder";
import { StartRecording } from "./StartRecording";
import getBlobDuration from "get-blob-duration";
import { Timers } from "./Timer";
import { ReactComponent as RedSign } from "../ui/icons/RedSign.svg";
import { WelcomeHeader } from "./WelcomeHeader";
import useMicrophonePermission from "./hooks/useMicrophonePermission";

const PlayerContainer = styled.div`
  background-color: ${Colors.lightGrey};
  width: 360px;
  height: 60px;
  border-radius: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Header1)`
  font-weight: bold;
  margin-bottom: 85px;
`;
const AudioContainer = styled.div`
  display: none;
`;
const StopBtn = styled(IconBtn)``;

const TrashBtn = styled(IconBtn)`
  width: 50px;
  height: 50px;
`;

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 70px;
  justify-content: space-between;
  align-items: center;
`;
const RedDotWrapper = styled.div`
  display: flex;
  animation: fadeIn 1s infinite alternate;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }
`;

export const RecordingPlayer = ({ sendMessage, hasHistory }) => {
  const audioRef = useRef(null);
  const [blobDuration, setBlobDuration] = useState(0);
  const [isReplay, setIsReplay] = useState(false);
  const [isMicrophoneAllowed, AlertMessage] = useMicrophonePermission();

  let [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    blob,
    setBlob,
    setAudioURL,
  ] = useRecorder();

  const handleAdd = async (title, blob) => {
    await sendMessage(title, blob);
    deleteRecord();
  };

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

  const currentTitle = useCallback(() => {
    if (!hasHistory) {
      if (!blob) {
        return !isRecording ? <WelcomeHeader /> : <Title>Recording...</Title>;
      }
      return <Title>Just one last step</Title>;
    }
  }, [blob, hasHistory, isRecording]);

  return (
    <>
      <AudioContainer>
        <audio src={audioURL} controls ref={audioRef} type="audio/mp4" />
      </AudioContainer>
      {currentTitle()}
      {!isRecording && !blob ? (
        <StartRecording startRecord={startRecord} hasHistory={hasHistory} />
      ) : (
        <PlayerContainer>
          <TrashBtn onClick={deleteRecord}>{blob && <TrashIcon />}</TrashBtn>
          {(blobDuration > 0 || isRecording) && (
            <TimerWrapper>
              {isRecording && (
                <RedDotWrapper>
                  <RedSign />
                </RedDotWrapper>
              )}
              <Timers
                blobDuration={blobDuration}
                isRecording={isRecording}
                handleTimeout={handleTimeout}
              />
            </TimerWrapper>
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
