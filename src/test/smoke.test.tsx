import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

function TestComponent() {
  return <h1>CineView</h1>;
}

test("renders test component", () => {
  render(<TestComponent />);
  expect(screen.getByText("CineView")).toBeInTheDocument();
});
