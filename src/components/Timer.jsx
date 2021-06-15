import React from "react";
import styled from "styled-components";
import Timer from "react-compound-timer";

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Timers = ({ blobDuration, handleTimeout, isRecording }) => (
  <TimerContainer>
    {blobDuration > 0 && (
      <Timer
        initialTime={0}
        direction="forward"
        startImmediately={false}
        checkpoints={[
          {
            time: blobDuration * 1000 - 1000,
            callback: () => handleTimeout(),
          },
        ]}
      >
        {({ start, pause, stop, reset }) => (
          <React.Fragment>
            <Timer.Minutes />:
            <Timer.Seconds
              formatValue={(value) => `${value < 10 ? `0${value}` : value} / `}
            />
            <button
              style={{ display: "none" }}
              id="leftTimerBtnPlay"
              onClick={start}
            ></button>
            <button
              style={{ display: "none" }}
              id="leftTimerBtnPause"
              onClick={pause}
            ></button>
            <button
              style={{ display: "none" }}
              id="leftTimerBtnReset"
              onClick={reset}
            ></button>
            <button
              style={{ display: "none" }}
              id="leftTimerBtnStop"
              onClick={stop}
            ></button>
          </React.Fragment>
        )}
      </Timer>
    )}
    <Timer
      initialTime={blobDuration * 1000}
      direction="forward"
      startImmediately={isRecording}
    >
      {({ start, pause, stop }) => (
        <React.Fragment>
          <Timer.Minutes />:
          <Timer.Seconds
            formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
          />
        </React.Fragment>
      )}
    </Timer>
  </TimerContainer>
);
