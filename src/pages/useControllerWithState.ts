import { useMemo, useState } from 'react';

/**
 * Generic React hook to synchronize a PlayPauseController (or similar) with React state.
 *
 * @param ControllerClass - The controller class constructor (e.g., PlayPauseController)
 * @param controllerArgs - Arguments to instantiate the controller
 * @returns [controllerInstance, isPlaying] tuple
 */
export function useControllerWithState<
  T extends {
    togglePlayPause: () => void;
    pause: () => void;
    play: () => void;
    getIsPlaying: () => boolean;
  },
>(
  ControllerClass: new (...args: any[]) => T,
  controllerArgs: any,
): [T, boolean] {
  const [isPlaying, setIsPlaying] = useState(false);

  const controller = useMemo(() => {
    const ctrl = new ControllerClass(controllerArgs);

    // override the togglePlayPause method to update React state
    const originalToggle = ctrl.togglePlayPause;
    ctrl.togglePlayPause = () => {
      originalToggle.call(ctrl);
      setIsPlaying(ctrl.getIsPlaying());
    };

    // override the pause method to update React state
    const originalPause = ctrl.pause;
    ctrl.pause = () => {
      originalPause.call(ctrl);
      setIsPlaying(false);
    };

    // override the play method to update React state
    const originalPlay = ctrl.play;
    ctrl.play = () => {
      originalPlay.call(ctrl);
      setIsPlaying(true);
    };

    return ctrl;
  }, controllerArgs);

  return [controller, isPlaying];
}
