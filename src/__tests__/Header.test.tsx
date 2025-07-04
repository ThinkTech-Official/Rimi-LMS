import { vi } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

import { render, screen } from "./test-utils";
import Header from "../components/Header";
import user from "@testing-library/user-event";
import i18n from "../i18n/i18";

describe("Admin Header", () => {
  beforeEach(() => {
    mockedNavigate.mockClear(); // Reset before each test
  });
  test("renders with default language and profile button", () => {
    render(<Header />);

    expect(screen.getByRole("language-btn")).toBeInTheDocument();
    expect(screen.getByRole("profile-btn")).toBeInTheDocument();
  });

  test("toggles language dropdown on click", async () => {
    user.setup();
    render(<Header />);
    const langButton = screen.getByRole("language-btn");
    await user.click(langButton);
    expect(screen.getByRole("button", { name: /^en$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^fr$/i })).toBeInTheDocument();
  });

  test("clicking already selected language closes dropdown without changing", async () => {
    user.setup();
    render(<Header />);

    // Open the dropdown
    const langButton = screen.getByRole("language-btn");
    await user.click(langButton);

    // Determine which language is currently selected (visible on button)
    const selectedLang = i18n.language.split("-")[0];

    // Click the same language inside the dropdown
    const selectedOption = screen.getByRole("button", {
      name: new RegExp(selectedLang, "i"),
    });
    await user.click(selectedOption);

    // Dropdown should now be closed
    expect(
      screen.queryByRole("button", { name: /^en$/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^fr$/i })
    ).not.toBeInTheDocument();
  });

  test("clicking a different language changes the language and closes the dropdown", async () => {
    user.setup();
    render(<Header />);

    // Open the dropdown
    const langButton = screen.getByRole("language-btn");
    await user.click(langButton);

    // Determine which language is currently selected (visible on button)
    const selectedLang = i18n.language.split("-")[0];

    // Click a different language inside the dropdown
    const selectedOption = screen.getByRole("button", {
      name: new RegExp(`^${selectedLang === "en" ? "fr" : "en"}$`, "i"),
    });
    await user.click(selectedOption);

    // Dropdown should now be closed
    expect(
      screen.queryByRole("button", { name: /^en$/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^fr$/i })
    ).not.toBeInTheDocument();
  });

  test("toggles profile menu on click", async () => {
    user.setup();
    render(<Header />);
    const profileButton = screen.getByRole("profile-btn");
    await user.click(profileButton);
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    await user.click(profileButton);
    expect(
      screen.queryByRole("button", { name: /logout/i })
    ).not.toBeInTheDocument();
  });

  test("clicking profile navigates to /admin/profile", async () => {
    user.setup();
    render(<Header />);
    const profileButton = screen.getByRole("profile-btn");
    await user.click(profileButton);
    expect(
      screen.getByRole("button", { name: /profile/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /profile/i }));
    expect(mockedNavigate).toHaveBeenCalledWith("/admin/profile");
  });

  test("shows logout button on profile menu open", async () => {
    user.setup();
    render(<Header />);
    await user.click(screen.getByText(/username/i));
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
