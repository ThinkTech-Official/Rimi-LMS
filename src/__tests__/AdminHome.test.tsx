import { render, screen, within } from "@testing-library/react";
import AdminHome from "../components/AdminHome";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
describe("AdminHome", () => {
  test("renders heading", () => {
    render(<AdminHome />);

    const heading = screen.getByRole("heading", {
      name: /daily active users/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test("renders stats", () => {
    render(<AdminHome />);

    const stats = screen.getAllByTestId("stat-card");
    expect(stats).toHaveLength(4);
  });

  test("renders chart", () => {
    render(<AdminHome />);

    const chart = screen.getAllByTestId("chart");
    expect(chart).toHaveLength(2);
  });

  test("renders table", () => {
    render(<AdminHome />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const headers = within(table).getAllByRole("columnheader");
    expect(headers).toHaveLength(5);

    const expectedHeaders = [
      /Client Name/i,
      /Email/i,
      /Date/i,
      /Number of Certificates/i,
      /Actions/i,
    ];

    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedHeaders[index]);
    });
  });
  test("view profile button click", async () => {
    user.setup();
    render(<AdminHome />);
    const button = screen.getAllByRole("button", { name: /view profile/i });
    expect(button.length).toBeGreaterThan(0);
    await user.click(button[0]);
    expect(screen.getAllByText(/password/i).length).toBeGreaterThan(0);
  });
});
