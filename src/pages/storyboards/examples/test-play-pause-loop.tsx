import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Box, Typography } from "@mui/material";
import usePlayPauseLoop from "../../../hooks/usePlayPauseLoop";

class Loop {
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
      console.log(`Iteration ${this.frameCount}`);

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

// Main component
const PlayPauseLoopComponent: React.FC = () => {
  // Create an instance of the Loop class
  const loop = useRef(new Loop()).current;

  const { isPlaying, togglePlayPause } = usePlayPauseLoop(loop);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
    >
      <Button
        variant="contained"
        color={isPlaying ? "secondary" : "primary"}
        onClick={togglePlayPause}
        sx={{ width: 120 }}
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </Box>
  );
};

function App() {
  return (
    <div className="App">
      <PlayPauseLoopComponent />
    </div>
  );
}

export default App;
