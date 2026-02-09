import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NoItemMessage from "./NoItemMessage";

describe("NoItemMessage", () => {
  describe("rendering", () => {
    it("renders the message", () => {
      render(<NoItemMessage message="Aucun archétype trouvé" />);
      expect(screen.getByText("Aucun archétype trouvé")).toBeInTheDocument();
    });

    it("has center text alignment by default", () => {
      const { container } = render(<NoItemMessage message="Message" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("text-center");
    });

    it("has left text when textPosition is left", () => {
      const { container } = render(<NoItemMessage message="Message" textPosition="left" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("text-left");
    });
  });
});
