import Courses from "../components/Courses";
import { screen, render } from "./test-utils";
import user from "@testing-library/user-event";

describe("courses", () => {
  test("renders the course page", () => {
    render(<Courses />);
    expect(true).toBeTruthy();
  });

  test("only one breadcrumb should be rendered", () => {
    render(<Courses />);

   const breadcrumbs = screen.getAllByRole("breadcrumbs");
   expect(breadcrumbs).toHaveLength(1);
  });

  test("all courses heading should be displayed",()=>{
    render(<Courses />);
    expect(screen.getByRole("heading", {name:/all courses/i})).toBeInTheDocument();
  })

  test("search course input should be displayed",()=>{
    render(<Courses />);
    expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument();
  })

  test("create course button should be displayed",()=>{
      render(<Courses />);
      expect(screen.getByRole("button", {name:/create course/i})).toBeInTheDocument();
  })

  test("clicking on create course buttton should show CreateCourse component", async () => {
    user.setup();
    render(<Courses />);
    const createCourseButton = screen.getByRole("button", {name:/create course/i});
    await user.click(createCourseButton);
    expect(screen.getByRole("button", {name:/save course/i})).toBeInTheDocument();
  })

  test("add category button should be displayed",()=>{
    render(<Courses />);
    expect(screen.getByRole("button", {name:/add category/i})).toBeInTheDocument();
  })

  test("onclicking add category button should show AddCategory modal", async () => {
    user.setup();
    render(<Courses />);
    const addCategoryButton = screen.getByRole("button", {name:/add category/i});
    await user.click(addCategoryButton);
    expect(screen.getByRole("heading", {name:/Add New Category/i})).toBeInTheDocument();
  })

  test("on clicking cancel button add category modal should get closed", async () => {
    user.setup();
    render(<Courses />);
    const addCategoryButton = screen.getByRole("button", {name:/add category/i});
    await user.click(addCategoryButton);
    const cancelButton = screen.getByRole("button", {name:/cancel/i});
    await user.click(cancelButton);
    expect(screen.queryByRole("heading", {name:/Add New Category/i})).not.toBeInTheDocument();
  })
});
