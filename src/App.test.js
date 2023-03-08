import { render, screen, fireEvent, act } from "@testing-library/react";
import { ProductCard, Autocomplete } from "./components";
import { mocked } from "ts-jest/utils";
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

  it("displays suggestions when typing in the search box", async () => {
    const mockedFetchSuggestions = mocked(fetchSuggestions);
    mockedFetchSuggestions.mockResolvedValueOnce([
      { id: 1, title: "Product 1" },
      { id: 2, title: "Product 2" },
    ]);

    render(<Autocomplete setProductShowing={jest.fn()} />);

    const input = screen.getByRole("textbox", {
      placeholder: /search for a product/i,
    });

    fireEvent.change(input, { target: { value: "product" } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const suggestion1 = screen.getByText(/product 1/i);
    const suggestion2 = screen.getByText(/product 2/i);

    expect(suggestion1).toBeInTheDocument();
    expect(suggestion2).toBeInTheDocument();
  });

  it("calls setProductShowing when clicking on a suggestion", async () => {
    const mockedFetchProductDetail = mocked(fetchProductDetail);
    mockedFetchProductDetail.mockResolvedValueOnce({
      id: 1,
      title: "Product 1 detail",
    });

    const mockSetProductShowing = jest.fn();

    const { getByText } = render(
      <Autocomplete setProductShowing={mockSetProductShowing} />
    );

    const input = screen.getByRole("textbox", {
      placeholder: /search for a product/i,
    });

    fireEvent.change(input, { target: { value: "product" } });

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    const suggestion1 = getByText(/product 1/i);

    fireEvent.click(suggestion1);

    expect(mockSetProductShowing).toHaveBeenCalledWith({
      id: 1,
      title: "Product 1 detail",
    });
  });
});
