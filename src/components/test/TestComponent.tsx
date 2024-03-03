import React from "react";
import { calculateSum } from "./TestFunction";

function TestComponent({ number1, number2 }) {
  const sum = calculateSum(number1, number2);

  return (
    <div>
      <p>Sum: {sum}</p>
    </div>
  );
}

export default TestComponent;
