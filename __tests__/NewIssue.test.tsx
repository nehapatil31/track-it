import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IssueForm from "../app/issues/_components/IssueForm"; // Adjust the path as necessary
import { useRouter } from "next/navigation";
import axios from "axios";
import { Issue } from "@prisma/client";

// Mock the router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock axios
jest.mock("axios");

const mockPush = jest.fn();
const mockRefresh = jest.fn();

(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
  refresh: mockRefresh,
});

describe("IssueForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with title and description inputs", () => {
    render(<IssueForm />);

    const titleInput = screen.getByTestId("title-input");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const submitButton = screen.getByRole("button", {
      name: /submit new issue/i,
    });

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("allows the user to input a title", () => {
    render(<IssueForm />);

    const titleInput = screen.getByTestId("title-input");
    fireEvent.change(titleInput, { target: { value: "New Issue Title" } });

    expect(titleInput).toHaveValue("New Issue Title");
  });

  it("allows the user to input a description", () => {
    render(<IssueForm />);

    const descriptionInput = screen.getByPlaceholderText("Description");
    fireEvent.change(descriptionInput, {
      target: { value: "New Issue Description" },
    });

    expect(descriptionInput).toHaveValue("New Issue Description");
  });

  //   it("submits the form and redirects on success", async () => {
  //     const mockIssue = {
  //       id: 1,
  //       title: "Test Issue",
  //       description: "Test Description",
  //     };
  //     (axios.post as jest.Mock).mockResolvedValue({ data: mockIssue });

  //     render(<IssueForm />);

  //     const titleInput = screen.getByTestId("title-input");
  //     const descriptionInput = screen.getByPlaceholderText("Description");
  //     const submitButton = screen.getByRole("button", {
  //       name: /submit new issue/i,
  //     });

  //     fireEvent.change(titleInput, { target: { value: "New Issue Title" } });
  //     fireEvent.change(descriptionInput, {
  //       target: { value: "New Issue Description" },
  //     });
  //     fireEvent.click(submitButton);

  //     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  //     await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/issues"));
  //     await waitFor(() => expect(mockRefresh).toHaveBeenCalledTimes(1));
  //   });

  //   it("shows an error message if submission fails", async () => {
  //     (axios.post as jest.Mock).mockRejectedValue(new Error("Submission failed"));

  //     render(<IssueForm />);

  //     const titleInput = screen.getByTestId("title-input");
  //     const descriptionInput = screen.getByPlaceholderText("Description");
  //     const submitButton = screen.getByRole("button", {
  //       name: /submit new issue/i,
  //     });

  //     fireEvent.change(titleInput, { target: { value: "New Issue Title" } });
  //     fireEvent.change(descriptionInput, {
  //       target: { value: "New Issue Description" },
  //     });
  //     fireEvent.click(submitButton);

  //     await waitFor(() =>
  //       expect(
  //         screen.getByText(/an unexpected error occurred/i)
  //       ).toBeInTheDocument()
  //     );
  //   });
});
