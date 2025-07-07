import { UserManagement } from "../components/UserManagement";
import { render, screen, within } from "./test-utils";
import user from "@testing-library/user-event";

describe("User Management", () => {
    test("renders the user management page", () => {
        render(<UserManagement />);
        expect(true).toBeTruthy();
    });

    test("only one breadcrumb should be rendered", () => {
        render(<UserManagement />);
        const breadcrumbs = screen.getAllByRole("breadcrumbs");
        expect(breadcrumbs).toHaveLength(1);
    });

    test("users heading should be displayed", () => {
        render(<UserManagement />);
        expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    })

    test("user filter radio buttons should be present", () => {
        render(<UserManagement />);
        expect(screen.getAllByRole("radio")).toHaveLength(2);
    })

    test("search by name input should be present", () => {
        render(<UserManagement />);
        expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
    })

      test("renders table", () => {
    render(<UserManagement />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    const headers = within(table).getAllByRole("columnheader");
    expect(headers).toHaveLength(6);

    const expectedHeaders = [
      /Name/i,
      /Email/i,
      /Course/i,
      /Progress/i,
      /Certificate Issued/i,
      /Action/i,
    ];

    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedHeaders[index]);
    });
  });
  test("view profile button click", async () => {
    user.setup();
    render(<UserManagement />);
    const button = screen.getAllByRole("button", { name: /view profile/i });
    expect(button.length).toBeGreaterThan(0);
    await user.click(button[0]);
    expect(screen.getAllByText(/password/i).length).toBeGreaterThan(0);
  });

  test("check if pagination is present", () => {
    render(<UserManagement />);
    expect(screen.getByRole("pagination")).toBeInTheDocument();
  })
});