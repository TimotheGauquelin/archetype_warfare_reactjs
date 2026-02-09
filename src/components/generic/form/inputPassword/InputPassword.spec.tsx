import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { InputPassword } from "./InputPassword";

describe("InputPassword", () => {
  const mockSetAction = vi.fn();

  const defaultProps = {
    label: "Password",
    attribute: "password",
    data: { password: "" },
    setAction: mockSetAction,
  };

  beforeEach(() => {
    mockSetAction.mockClear();
  });

  const InputPasswordWithState = ({ initialValue = "", ...props }: { initialValue?: string; [key: string]: unknown }) => {
    const [data, setData] = useState({ password: initialValue });
    return <InputPassword {...defaultProps} {...props} data={data} setAction={setData} />;
  };

  describe("rendering", () => {
    it("renders label", () => {
      render(<InputPassword {...defaultProps} />);
      expect(screen.getByText("Password:")).toBeInTheDocument();
    });

    it("renders required indicator when required is true", () => {
      render(<InputPassword {...defaultProps} required />);
      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass("text-red-500", "font-bold");
    });

    it("does not render required indicator when required is false", () => {
      render(<InputPassword {...defaultProps} required={false} />);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("renders password input by default", () => {
      render(<InputPassword {...defaultProps} />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "password");
    });

    it("renders eye icon", () => {
      const { container } = render(<InputPassword {...defaultProps} />);
      const eyeIcon = container.querySelector("svg");
      expect(eyeIcon).toBeInTheDocument();
    });
  });

  describe("value handling", () => {
    it("displays value from data object", () => {
      render(<InputPassword {...defaultProps} data={{ password: "secret123" }} />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input.value).toBe("secret123");
    });

    it("displays empty string when attribute value is undefined", () => {
      render(<InputPassword {...defaultProps} data={{ password: undefined }} />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("handles empty string value", () => {
      render(<InputPassword {...defaultProps} data={{ password: "" }} />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });

  describe("password visibility toggle", () => {
    it("toggles password visibility when eye icon is clicked", async () => {
      render(<InputPassword {...defaultProps} />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      const toggleButton = input.nextElementSibling as HTMLElement;

      expect(input).toHaveAttribute("type", "password");

      await userEvent.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");

      await userEvent.click(toggleButton);
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("user interaction", () => {
    it("calls setAction when input value changes", async () => {
      render(<InputPasswordWithState />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;

      await userEvent.type(input, "test");

      expect(input.value).toBe("test");
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled is true", () => {
      render(<InputPassword {...defaultProps} disabled />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input).toBeDisabled();
      expect(input).toHaveClass("disabled:opacity-50");
    });

    it("renders as enabled when disabled is false", () => {
      render(<InputPassword {...defaultProps} disabled={false} />);
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });
  });
});
