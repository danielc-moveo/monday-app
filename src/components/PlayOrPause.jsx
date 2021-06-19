import React, { useCallback, useRef, useState } from "react";
import { IconBtn } from "../ui/Layouts";
import { ReactComponent as PlayIcon } from "../ui/icons/Play.svg";
import { ReactComponent as PauseIcon } from "../ui/icons/Pause.svg";

export const PlayOrPause = ({ play, pause, isReplay, setIsReplay }) => {
  //const [isReplay, setIsReplay] = useState(false);

  const handlePlay = useCallback(() => {
    play();
    setIsReplay(true);
  }, []);
  const handlePause = useCallback(() => {
    pause();
    setIsReplay(false);
  }, []);

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
