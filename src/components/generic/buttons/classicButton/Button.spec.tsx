import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  const mockAction = vi.fn();

  beforeEach(() => {
    mockAction.mockClear();
  });

  describe("rendering", () => {
    it("renders button with buttonText", () => {
      render(<Button buttonText="Cliquer" />);
      expect(screen.getByRole("button", { name: /Cliquer/i })).toBeInTheDocument();
    });

    it("renders button with children", () => {
      render(
        <Button>
          <span data-testid="child">Enfant</span>
        </Button>
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByRole("button")).toContainElement(screen.getByTestId("child"));
    });

    it("renders with custom className", () => {
      render(<Button buttonText="Ok" className="bg-black text-white" />);
      const btn = screen.getByRole("button");
      expect(btn).toHaveClass("bg-black", "text-white");
    });

    it("has type button by default", () => {
      render(<Button buttonText="Ok" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("has type submit when submit is true", () => {
      render(<Button buttonText="Envoyer" submit />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });

  describe("disabled state", () => {
    it("is not disabled by default", () => {
      render(<Button buttonText="Ok" />);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("is disabled when disabled is true", () => {
      render(<Button buttonText="Ok" disabled />);
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(btn).toHaveClass("opacity-50", "cursor-not-allowed", "grayscale");
    });

    it("does not call action when disabled and clicked", async () => {
      render(<Button buttonText="Ok" disabled action={mockAction} />);
      await userEvent.click(screen.getByRole("button"));
      expect(mockAction).not.toHaveBeenCalled();
    });
  });

  describe("action", () => {
    it("calls action when clicked", async () => {
      render(<Button buttonText="Ok" action={mockAction} />);
      await userEvent.click(screen.getByRole("button"));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it("does not call action when action is undefined", async () => {
      render(<Button buttonText="Ok" />);
      await userEvent.click(screen.getByRole("button"));
      expect(mockAction).not.toHaveBeenCalled();
    });

  });
});
