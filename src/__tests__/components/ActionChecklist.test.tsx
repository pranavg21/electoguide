import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ActionChecklist } from "@/components/generative/ActionChecklist";
import type { ChecklistOutput } from "@/lib/schemas";

const mockData: ChecklistOutput = {
  title: "Voter Registration Checklist",
  description: "Complete these steps to register",
  items: [
    { id: "1", text: "Check citizenship", description: "Verify Indian citizenship", completed: false, priority: "high" },
    { id: "2", text: "Verify age", description: "Must be 18+ on qualifying date", completed: false, priority: "medium" },
    { id: "3", text: "Gather documents", completed: false, priority: "low" },
    { id: "4", text: "Visit NVSP portal", completed: false, url: "https://voters.eci.gov.in", priority: "high" },
  ],
};

describe("ActionChecklist", () => {
  it("renders the checklist title and description", () => {
    render(<ActionChecklist data={mockData} />);
    expect(screen.getByText("Voter Registration Checklist")).toBeInTheDocument();
    expect(screen.getByText("Complete these steps to register")).toBeInTheDocument();
  });

  it("renders all checklist items", () => {
    render(<ActionChecklist data={mockData} />);
    expect(screen.getByText("Check citizenship")).toBeInTheDocument();
    expect(screen.getByText("Verify age")).toBeInTheDocument();
    expect(screen.getByText("Gather documents")).toBeInTheDocument();
    expect(screen.getByText("Visit NVSP portal")).toBeInTheDocument();
  });

  it("displays priority badges", () => {
    render(<ActionChecklist data={mockData} />);
    const highBadges = screen.getAllByText("High");
    expect(highBadges.length).toBe(2);
    expect(screen.getByText("Med")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("toggles check state on click", () => {
    render(<ActionChecklist data={mockData} />);
    const firstItem = screen.getByLabelText("Check: Check citizenship");
    fireEvent.click(firstItem);
    expect(screen.getByLabelText("Uncheck: Check citizenship")).toBeInTheDocument();
  });

  it("shows counter as 0/4 initially", () => {
    render(<ActionChecklist data={mockData} />);
    expect(screen.getByText("0/4")).toBeInTheDocument();
  });

  it("updates counter when items are checked", () => {
    render(<ActionChecklist data={mockData} />);
    fireEvent.click(screen.getByLabelText("Check: Check citizenship"));
    expect(screen.getByText("1/4")).toBeInTheDocument();
  });

  it("renders external resource links", () => {
    render(<ActionChecklist data={mockData} />);
    const link = screen.getByText("Visit resource");
    expect(link).toHaveAttribute("href", "https://voters.eci.gov.in");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows completion message when all items checked", () => {
    render(<ActionChecklist data={mockData} />);
    fireEvent.click(screen.getByLabelText("Check: Check citizenship"));
    fireEvent.click(screen.getByLabelText("Check: Verify age"));
    fireEvent.click(screen.getByLabelText("Check: Gather documents"));
    fireEvent.click(screen.getByLabelText("Check: Visit NVSP portal"));
    expect(screen.getByText(/All items completed/)).toBeInTheDocument();
  });

  it("has proper accessibility labels on all buttons", () => {
    render(<ActionChecklist data={mockData} />);
    expect(screen.getByLabelText("Check: Check citizenship")).toBeInTheDocument();
    expect(screen.getByLabelText("Check: Verify age")).toBeInTheDocument();
  });
});
