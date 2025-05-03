import React, { useRef, useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';

import { useControllerWithState } from '../useControllerWithState';

class Loop {
  public onFrame?: () => void;
  private frameCount: number;
  private animationRef: number | null;
  private isPlayingRef: { current: boolean };
  private count: number;
  private total: number;

  constructor() {
    this.frameCount = 0;
    this.animationRef = null;
    this.isPlayingRef = { current: false };
    this.count = 0;
    this.total = 1000;
  }

  togglePlayPause = () => {
    this.isPlayingRef.current = !this.isPlayingRef.current;
  };

  runLoop = () => {
    const loop = () => {
      if (!this.isPlayingRef.current || this.count >= this.total) {
        return;
      }

      this.frameCount++;
      if (this.onFrame) this.onFrame();
      this.animationRef = requestAnimationFrame(loop);
      this.count++;
    };

    loop();
  };

  play = () => {
    this.isPlayingRef.current = true;
    this.runLoop();
  };

  pause = () => {
    this.isPlayingRef.current = false;

    if (this.animationRef) {
      cancelAnimationFrame(this.animationRef);
    }
  };

  getFrameCount = () => {
    return this.frameCount;
  };
}

// Controller for two loops in sync
class SynchronizedLoopsController {
  private loops: Loop[];
  constructor(loops: Loop[]) {
    this.loops = loops;
  }
  togglePlayPause = () => {
    if (this.getIsPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  };
  play = () => {
    this.loops.forEach((loop) => loop.play());
  };
  pause = () => {
    this.loops.forEach((loop) => loop.pause());
  };
  getIsPlaying = () =>
    this.loops.some((loop) => (loop as any).isPlayingRef?.current);
}

// Minimal PlayPauseController for Loop
class LoopController {
  private loop: Loop;
  private isPlaying: boolean = false;
  constructor(loop: Loop) {
    this.loop = loop;
    this.loop.onFrame = () => {};
  }
  togglePlayPause = () => {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  };
  play = () => {
    this.isPlaying = true;
    this.loop.onFrame = () => {};
    this.loop.play();
  };
  pause = () => {
    this.isPlaying = false;
    this.loop.pause();
  };
  getIsPlaying = () => this.isPlaying;
}

// Single loop demo
const SingleLoopComponent: React.FC = () => {
  const loop = useRef(new Loop()).current;
  const [frameCount, setFrameCount] = useState(0);
  const [controller, isPlaying] = useControllerWithState(LoopController, [
    loop,
  ]);

  useEffect(() => {
    loop.onFrame = () => setFrameCount(loop.getFrameCount());
    if (!isPlaying) setFrameCount(loop.getFrameCount());
    return () => {
      loop.onFrame = undefined;
    };
  }, [isPlaying, loop]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
      mb={4}
      border={1}
      borderColor="grey.400"
      borderRadius={2}
    >
      <Typography variant="h6">Single Loop Demo</Typography>
      <Button
        variant="contained"
        color={isPlaying ? 'secondary' : 'primary'}
        onClick={controller.togglePlayPause}
        sx={{ width: 120 }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <Typography variant="body1">Counter: {frameCount}</Typography>
    </Box>
  );
};

// Synchronized two-loop demo
const SynchronizedLoopsComponent: React.FC = () => {
  const loopA = useRef(new Loop()).current;
  const loopB = useRef(new Loop()).current;
  const [frameCountA, setFrameCountA] = useState(0);
  const [frameCountB, setFrameCountB] = useState(0);
  const [controller, isPlaying] = useControllerWithState(
    SynchronizedLoopsController,
    [[loopA, loopB]],
  );

  useEffect(() => {
    loopA.onFrame = () => setFrameCountA(loopA.getFrameCount());
    loopB.onFrame = () => setFrameCountB(loopB.getFrameCount());
    if (!isPlaying) {
      setFrameCountA(loopA.getFrameCount());
      setFrameCountB(loopB.getFrameCount());
    }
    return () => {
      loopA.onFrame = undefined;
      loopB.onFrame = undefined;
    };
  }, [isPlaying, loopA, loopB]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
      border={1}
      borderColor="grey.400"
      borderRadius={2}
    >
      <Typography variant="h6">Synchronized Two-Loop Demo</Typography>
      <Button
        variant="contained"
        color={isPlaying ? 'secondary' : 'primary'}
        onClick={controller.togglePlayPause}
        sx={{ width: 120 }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      <Typography variant="body1">Counter A: {frameCountA}</Typography>
      <Typography variant="body1">Counter B: {frameCountB}</Typography>
    </Box>
  );
};

function App() {
  return (
    <div className="App">
      <SingleLoopComponent />
      <SynchronizedLoopsComponent />
    </div>
  );
}

export default App;
