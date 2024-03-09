import React from "react";
import { render } from "@testing-library/react";
import ExampleComponent from "../components/test/ExampleComponent";

describe("TestComponent component", () => {
  it("should calculate the sum correctly and render", async () => {
    // Arrange:
    const { findByText } = render(<ExampleComponent number1={2} number2={3} />);
    // Act:
    const sumElement = await findByText("Sum: 5");
    // Assert: ensure the sumElement is present in the document
    expect(sumElement).toBeTruthy();
  });
});
