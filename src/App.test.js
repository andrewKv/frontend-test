import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProductCard, Autocomplete } from "./components";
import { fetchProductDetail, fetchSuggestions } from "./utils/api";

jest.mock("./utils/api");

describe("Autocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ****************** autocomplete component tests ******************//
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
      }, 500);
    });
  });

  it("calls fetchProductDetail when a suggestion is clicked", async () => {
    const setProductShowing = jest.fn();
    render(<Autocomplete setProductShowing={setProductShowing} />);

    const input = screen.getByRole("textbox", {
      placeholder: /search for a product/i,
    });

    await waitFor(() => {
      setTimeout(() => {
        fireEvent.change(input, { target: { value: "Mens" } });
        expect(fetchSuggestions).toHaveBeenCalledTimes(1);
        expect(fetchSuggestions).toHaveBeenCalledWith("Mens");
      }, 500); // timers to wait for debounce
    });

    await waitFor(() => {
      setTimeout(() => {
        const suggestion = screen.getByRole("suggestion", {
          value: "Mens Cotton Jacket",
        });
        fireEvent.click(suggestion);
        expect(fetchProductDetail).toHaveBeenCalledTimes(1);
        expect(fetchProductDetail).toHaveBeenCalledWith("Mens Cotton Jacket");
      }, 500);
    });
  });

  // ****************** product component tests ******************//
  const product = {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  };

  it("renders product title", () => {
    render(<ProductCard product={product} />);
    const titleElement = screen.getByText(product.title);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders product image", () => {
    render(<ProductCard product={product} />);
    const imageElement = screen.getByAltText(`Product ${product.title}`);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toBe(product.image);
  });

  it("renders product description collapsed by default", () => {
    render(<ProductCard product={product} />);
    const descriptionElement = screen.getByText(product.description);
    expect(descriptionElement).toHaveClass("row");
    expect(descriptionElement).not.toHaveClass("expanded");
  });

  it("expands product description when clicked", () => {
    render(<ProductCard product={product} />);
    const descriptionElement = screen.getByText(product.description);
    fireEvent.click(descriptionElement);
    expect(descriptionElement).toHaveClass("row expanded");
  });

  it("collapses product description when clicked again", () => {
    render(<ProductCard product={product} />);
    const descriptionElement = screen.getByText(product.description);
    fireEvent.click(descriptionElement);
    fireEvent.click(descriptionElement);
    expect(descriptionElement).toHaveClass("row");
    expect(descriptionElement).not.toHaveClass("expanded");
  });

  it("renders formatted product price", () => {
    render(<ProductCard product={product} />);
    const priceElement = screen.getByText("£109.95");
    expect(priceElement).toBeInTheDocument();
  });
});
