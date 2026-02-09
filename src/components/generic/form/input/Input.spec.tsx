import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Input } from "./Input";

describe("Input", () => {
  const mockSetAction = vi.fn();

  const defaultProps = {
    attribute: "testField",
    data: { testField: "" },
    setAction: mockSetAction,
  };

  beforeEach(() => {
    mockSetAction.mockClear();
  });

  const InputWithState = ({ initialValue = "", ...props }: { initialValue?: string; [key: string]: unknown }) => {
    const [data, setData] = useState({ testField: initialValue });
    return <Input {...defaultProps} {...props} data={data} setAction={setData} />;
  };

  describe("rendering", () => {
    it("renders input without label when label is not provided", () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(screen.queryByText(/testField/)).not.toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(<Input {...defaultProps} label="Test Label" />);
      expect(screen.getByText("Test Label:")).toBeInTheDocument();
    });

    it("renders required indicator when required is true", () => {
      render(<Input {...defaultProps} label="Test Label" required />);
      const requiredIndicator = screen.getByText("*");
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveClass("text-red-500", "font-bold");
    });

    it("does not render required indicator when required is false", () => {
      render(<Input {...defaultProps} label="Test Label" required={false} />);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("renders placeholder when provided", () => {
      render(<Input {...defaultProps} placeholder="Enter text here" />);
      const input = screen.getByPlaceholderText("Enter text here");
      expect(input).toBeInTheDocument();
    });
  });

  describe("value handling", () => {
    it("displays value from data object", () => {
      render(<Input {...defaultProps} data={{ testField: "test value" }} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("test value");
    });

    it("displays empty string when attribute value is undefined", () => {
      render(<Input {...defaultProps} data={{ testField: undefined }} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    it("converts number to string", () => {
      render(<Input {...defaultProps} data={{ testField: 123 }} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("123");
    });

    it("handles empty string value", () => {
      render(<Input {...defaultProps} data={{ testField: "" }} />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });

  describe("user interaction", () => {
    it("calls setAction when input value changes", async () => {
      render(<InputWithState />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      await userEvent.type(input, "test");

      expect(input.value).toBe("test");
    });

    it("updates the correct attribute when typing", async () => {
      const InputWithMultipleFields = () => {
        const [data, setData] = useState({ username: "", email: "" });
        return <Input attribute="username" data={data} setAction={setData} />;
      };

      render(<InputWithMultipleFields />);
      const input = screen.getByRole("textbox") as HTMLInputElement;

      await userEvent.type(input, "john");

      expect(input.value).toBe("john");
    });
  });

  describe("disabled state", () => {
    it("renders as disabled when disabled is true", () => {
      render(<Input {...defaultProps} disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("opacity-50");
    });

    it("renders as enabled when disabled is false", () => {
      render(<Input {...defaultProps} disabled={false} />);
      const input = screen.getByRole("textbox");
      expect(input).not.toBeDisabled();
    });
  });
});
