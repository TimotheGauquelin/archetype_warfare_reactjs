import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UserBasicLayout from "./layout";

vi.mock("../../components/generic/header/Header", () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock("@/components/generic/Hero", () => ({
  default: ({
    mainTitle,
    subTitle,
  }: {
    mainTitle: string;
    subTitle: string;
  }) => (
    <div data-testid="hero">
      <span data-testid="hero-main-title">{mainTitle}</span>
      <span data-testid="hero-sub-title">{subTitle}</span>
    </div>
  ),
}));

vi.mock("@/components/generic/footer/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

describe("UserBasicLayout (UserHeroLayout)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders Header", () => {
      render(
        <UserBasicLayout mainTitle="Titre" subTitle="Sous-titre">
          <span>Content</span>
        </UserBasicLayout>
      );
      expect(screen.getByTestId("header")).toBeInTheDocument();
    });

    it("renders Hero with mainTitle and subTitle", () => {
      render(
        <UserBasicLayout mainTitle="Mon titre" subTitle="Mon sous-titre">
          <span>Content</span>
        </UserBasicLayout>
      );
      expect(screen.getByTestId("hero")).toBeInTheDocument();
      expect(screen.getByTestId("hero-main-title")).toHaveTextContent("Mon titre");
      expect(screen.getByTestId("hero-sub-title")).toHaveTextContent("Mon sous-titre");
    });

    it("renders Footer", () => {
      render(
        <UserBasicLayout mainTitle="Titre" subTitle="Sous-titre">
          <span>Content</span>
        </UserBasicLayout>
      );
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders children in the content area", () => {
      render(
        <UserBasicLayout mainTitle="Titre" subTitle="Sous-titre">
          <div data-testid="page-content">Page content here</div>
        </UserBasicLayout>
      );
      expect(screen.getByTestId("page-content")).toBeInTheDocument();
      expect(screen.getByText("Page content here")).toBeInTheDocument();
    });

    it("renders layout when children is empty", () => {
      render(
        <UserBasicLayout mainTitle="Titre" subTitle="Sous-titre">
          <></>
        </UserBasicLayout>
      );
      expect(screen.getByTestId("header")).toBeInTheDocument();
      expect(screen.getByTestId("hero")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("content area has max-w-containerSize and mx-auto classes", () => {
      const { container } = render(
        <UserBasicLayout mainTitle="Titre" subTitle="Sous-titre">
          <span>Content</span>
        </UserBasicLayout>
      );
      const contentWrapper = container.querySelector(".max-w-containerSize.mx-auto");
      expect(contentWrapper).toBeInTheDocument();
    });
  });
});
