import React, { useCallback } from 'react';
import { IconBtn } from '../ui/Layouts';
import { ReactComponent as PlayIcon } from '../ui/icons/Play.svg';
import { ReactComponent as PauseIcon } from '../ui/icons/Pause.svg';

export const PlayOrPause = ({ play, pause, isReplay, setIsReplay }) => {
  const handlePlay = useCallback(() => {
    play();
    setIsReplay(true);
  }, [play, setIsReplay]);
  const handlePause = useCallback(() => {
    pause();
    setIsReplay(false);
  }, [pause, setIsReplay]);

  return (
    <>
      {!isReplay ? (
        <IconBtn onClick={handlePlay}>
          <PlayIcon />
        </IconBtn>
      ) : (
        <IconBtn onClick={handlePause}>
          <PauseIcon />
        </IconBtn>
      )}
    </>
  );
};
