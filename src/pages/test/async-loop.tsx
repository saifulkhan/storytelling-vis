import type { NextPage } from "next";

import React, { useState, useCallback, useRef } from "react";

const AsyncLoopPage: NextPage = () => {
  return (
    <div>
      <AsyncLoopController />
    </div>
  );
};

export default AsyncLoopPage;

////////////////////////////////////////////////////////////////////////////////

// Define the props for our component
interface AsyncLoopControllerProps {
  // Add any props here if needed
}

const AsyncLoopController: React.FC<AsyncLoopControllerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [output, setOutput] = useState<string[]>([]);
  const loopRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated async function that prints a number
  const asyncTask = async (): Promise<void> => {
    console.log(`Printing number: ${currentNumber}`);
    setOutput((prev) => [...prev, `Number: ${currentNumber}`]);
    setCurrentNumber((prev) => prev + 1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // The main loop function
  const loop = useCallback(async () => {
    if (!isPlaying) return;

    await asyncTask();

    // Schedule the next iteration
    loopRef.current = setTimeout(loop, 0);
  }, [isPlaying, currentNumber]);

  // Start the loop
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    loop();
  }, [loop]);

  // Pause the loop
  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (loopRef.current) {
      clearTimeout(loopRef.current);
    }
  }, []);

  // Reset the loop
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentNumber(1);
    setOutput([]);
    if (loopRef.current) {
      clearTimeout(loopRef.current);
    }
  }, []);

  return (
    <div>
      <h1>Async Loop Controller</h1>
      <button onClick={handlePlay} disabled={isPlaying}>
        Play
      </button>
      <button onClick={handlePause} disabled={!isPlaying}>
        Pause
      </button>
      <button onClick={handleReset}>Reset</button>
      <p>{isPlaying ? "Loop is running" : "Loop is paused"}</p>
      <p>Current Number: {currentNumber - 1}</p>
      <div>
        <h2>Output:</h2>
        {output.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};
