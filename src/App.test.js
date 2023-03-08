import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { ProductCard, Autocomplete } from "./components";
import { fetchProductDetail, fetchSuggestions } from "./utils/api";

jest.mock("./utils/api");

describe("Autocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<Autocomplete setProductShowing={jest.fn()} />);

    const input = screen.getByRole("textbox", {
      placeholder: /search for a product/i,
    });

    expect(input).toBeInTheDocument();
  });

  it("calls fetchSuggestions when input changes", async () => {
    render(<Autocomplete setProductShowing={jest.fn()} />);

    const input = screen.getByRole("textbox", {
      placeholder: /search for a product/i,
    });

    await waitFor(() => {
      fireEvent.change(input, { target: { value: "test" } });
      expect(fetchSuggestions).toHaveBeenCalledTimes(1);
      expect(fetchSuggestions).toHaveBeenCalledWith("test");
    });
  });

  it("calls setProductShowing when a suggestion is clicked", async () => {
    const setProductShowing = jest.fn();

    render(<Autocomplete setProductShowing={setProductShowing} />);

    const input = screen.getByRole("textbox", {
      placeholder: /search for a product/i,
    });

    await waitFor(() => {
      fireEvent.change(input, { target: { value: "Mens" } });
      expect(fetchSuggestions).toHaveBeenCalledTimes(1);
      expect(fetchSuggestions).toHaveBeenCalledWith("Mens");
    });

    await waitFor(() => {
      setTimeout(() => {
        const suggestion = screen.getByRole("suggestion", {
          value: "Mens Cotton Jacket",
        });
        fireEvent.click(suggestion);
        expect(setProductShowing).toHaveBeenCalledTimes(1);
        expect(setProductShowing).toHaveBeenCalled();
      });
    });
  });
});
