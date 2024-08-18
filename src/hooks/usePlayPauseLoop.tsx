/**
 * Custom hook for managing play/pause loop
 */

import { useState, useEffect, useCallback } from "react";

const usePlayPauseLoop = (obj: any) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
    obj.togglePlayPause();
  }, [setIsPlaying, obj]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    obj.pause();
  }, [setIsPlaying, obj]);

  useEffect(() => {
    if (isPlaying) {
      obj.play();
    } else {
      obj.pause();
    }

    return () => {
      obj.pause();
    };
  }, [isPlaying, obj]);

  return { isPlaying, togglePlayPause, pause };
};

export default usePlayPauseLoop;
