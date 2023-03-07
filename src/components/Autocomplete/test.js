import React from "react";
import {render, screen} from '@testing-library/react'

import Autocomplete from "./Autocomplete";

jest.mock("./utils/api");

describe("Autocomplete", () => {
  it("renders correctly", () => {
    render(<Autocomplete />);

    const input = screen.getByRole('textbox', {placeholder: /search for a product/i})
    
    expect(input).toBeInTheDocument();
  });
});
