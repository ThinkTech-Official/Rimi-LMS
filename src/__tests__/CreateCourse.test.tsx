import { vi } from "vitest";
import CreateCourse from "../components/CreateCourse";
import { render, screen } from "./test-utils";

describe("CreateCourse", () => {
    const mockOnCreateTest = vi.fn();

    test("renders", () => {
      render(<CreateCourse onCreateTest={mockOnCreateTest} />);
      expect(true).toBeTruthy();
    });

    test("checking for breadcrumbs", () => {
      render(<CreateCourse onCreateTest={mockOnCreateTest}/>);
      expect(screen.getAllByRole("breadcrumbs")).toHaveLength(2);
    });
});