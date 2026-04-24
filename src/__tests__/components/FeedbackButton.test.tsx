import { render, screen, fireEvent } from "@testing-library/react";
import { FeedbackButton } from "@/components/ui/FeedbackButton";

// Mock the dependencies
jest.mock("@/lib/firestore", () => ({
  submitFeedback: jest.fn().mockResolvedValue("mock-doc-id"),
}));
jest.mock("@/lib/analytics", () => ({
  trackEvent: jest.fn().mockResolvedValue(undefined),
}));

describe("FeedbackButton", () => {
  const defaultProps = {
    messageId: "msg-1",
    language: "en",
  };

  it("renders thumbs up and down buttons", () => {
    render(<FeedbackButton {...defaultProps} />);
    expect(screen.getByLabelText("Helpful response")).toBeInTheDocument();
    expect(screen.getByLabelText("Unhelpful response")).toBeInTheDocument();
  });

  it("shows Rate button for detailed feedback", () => {
    render(<FeedbackButton {...defaultProps} />);
    expect(screen.getByLabelText("Show detailed rating options")).toBeInTheDocument();
  });

  it("shows thank you message after thumbs up", () => {
    render(<FeedbackButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Helpful response"));
    expect(screen.getByText("Thanks for your feedback!")).toBeInTheDocument();
  });

  it("shows thank you message after thumbs down", () => {
    render(<FeedbackButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Unhelpful response"));
    expect(screen.getByText("Thanks for your feedback!")).toBeInTheDocument();
  });

  it("shows star rating when Rate is clicked", () => {
    render(<FeedbackButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Show detailed rating options"));
    expect(screen.getByLabelText("Rate 1 out of 5 stars")).toBeInTheDocument();
    expect(screen.getByLabelText("Rate 5 out of 5 stars")).toBeInTheDocument();
  });

  it("submits star rating and shows confirmation", () => {
    render(<FeedbackButton {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Show detailed rating options"));
    fireEvent.click(screen.getByLabelText("Rate 4 out of 5 stars"));
    expect(screen.getByText("Thanks for your feedback!")).toBeInTheDocument();
  });

  it("has proper accessibility role for rating group", () => {
    render(<FeedbackButton {...defaultProps} />);
    expect(screen.getByRole("group")).toHaveAttribute("aria-label", "Rate this response");
  });

  it("accepts optional toolName prop", () => {
    render(<FeedbackButton {...defaultProps} toolName="showEVMSimulator" />);
    expect(screen.getByLabelText("Helpful response")).toBeInTheDocument();
  });
});
