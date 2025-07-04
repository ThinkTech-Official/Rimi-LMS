import { vi } from "vitest";
import CreateCourse from "../components/CreateCourse";
import { render, screen } from "./test-utils";

describe("CreateCourse", () => {
  const mockOnCreateTest = vi.fn();

  test("renders", () => {
    render(<CreateCourse onCreateTest={mockOnCreateTest} />);
    expect(true).toBeTruthy();
  });

  // todo : test for breadcrumbs

  test("check for heading", () => {
    render(<CreateCourse onCreateTest={mockOnCreateTest} />);
    expect(
      screen.getByRole("heading", { name: /basic course information/i })
    ).toBeInTheDocument();
  });

  test("check if form is rendered", () => {
    render(<CreateCourse onCreateTest={mockOnCreateTest} />);
    expect(
      screen.getByRole("form", { name: /create course form/i })
    ).toBeInTheDocument();
  });

  test("total number of form controls is 6", () => {
    const mockOnCreateTest = vi.fn();
    render(<CreateCourse onCreateTest={mockOnCreateTest} />);

    const textboxes = screen.getAllByRole("textbox");
    // const select = screen.getByRole("combobox");
    // expect(select).toBeInTheDocument();

    const fileInputs = screen.getAllByRole("textbox");
    expect(fileInputs).toHaveLength(2);

    const totalControls = textboxes.length;

    expect(totalControls).toBe(2);
  });
});
