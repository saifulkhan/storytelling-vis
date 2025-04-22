/**
 * Custom hook for synchronizing multiple plots in animation
 */

import { useState, useEffect, useCallback } from 'react';

export const useSynchronizedPlots = (plots: any[]) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
    plots.forEach((plot) => {
      if (plot && typeof plot.togglePlayPause === 'function') {
        plot.togglePlayPause();
      }
    });
  }, [setIsPlaying, plots]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    plots.forEach((plot) => {
      if (plot && typeof plot.pause === 'function') {
        plot.pause();
      }
    });
  }, [setIsPlaying, plots]);

  useEffect(() => {
    if (isPlaying) {
      plots.forEach((plot) => {
        if (plot && typeof plot.play === 'function') {
          plot.play();
        }
      });
    } else {
      plots.forEach((plot) => {
        if (plot && typeof plot.pause === 'function') {
          plot.pause();
        }
      });
    }

    return () => {
      plots.forEach((plot) => {
        if (plot && typeof plot.pause === 'function') {
          plot.pause();
        }
      });
    };
  }, [isPlaying, plots]);

  return { isPlaying, togglePlayPause, pause };
};
