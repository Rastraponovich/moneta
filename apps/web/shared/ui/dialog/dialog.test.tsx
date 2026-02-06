import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "./dialog";

// Мокируем useEffect для проверки body overflow
const originalBodyStyle = document.body.style.overflow;

describe("Dialog", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = originalBodyStyle;
  });

  it("does not render when isOpen is false", () => {
    render(
      <Dialog isOpen={false} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.getByText("Dialog Content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose} title="Test Dialog">
        <div>Dialog Content</div>
      </Dialog>
    );

    const closeButton = screen.getByLabelText("Закрыть");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    // Находим overlay (родительский div с bg-black/50)
    const overlay = screen.getByText("Dialog Content").closest(".fixed");
    if (overlay) {
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it("does not call onClose when dialog content is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    const content = screen.getByText("Dialog Content");
    await user.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("closes on Escape key press", async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    await user.keyboard("{Escape}");

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape when loading", async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose} loading={true}>
        <div>Dialog Content</div>
      </Dialog>
    );

    await user.keyboard("{Escape}");

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("does not close on overlay click when loading", async () => {
    const user = userEvent.setup();
    render(
      <Dialog isOpen={true} onClose={mockOnClose} loading={true}>
        <div>Dialog Content</div>
      </Dialog>
    );

    const overlay = screen.getByText("Dialog Content").closest(".fixed");
    if (overlay) {
      await user.click(overlay);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });

  it("disables close button when loading", () => {
    render(
      <Dialog
        isOpen={true}
        onClose={mockOnClose}
        title="Test Dialog"
        loading={true}
      >
        <div>Dialog Content</div>
      </Dialog>
    );

    const closeButton = screen.getByLabelText("Закрыть");
    expect(closeButton).toBeDisabled();
  });

  it("shows loading overlay when loading is true", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose} loading={true}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(screen.getByText("Сохранение...")).toBeInTheDocument();
  });

  it("blocks body scroll when open", () => {
    render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll when closed", () => {
    const { rerender } = render(
      <Dialog isOpen={true} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Dialog isOpen={false} onClose={mockOnClose}>
        <div>Dialog Content</div>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe("unset");
  });
});
