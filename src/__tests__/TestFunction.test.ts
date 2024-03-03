import { calculateSum } from "../components/test/TestFunction";

describe("calculateSum function", () => {
  it("should calculate the sum correctly", () => {
    const sum = calculateSum(2, 3);
    expect(sum).toBe(5);
  });
});
