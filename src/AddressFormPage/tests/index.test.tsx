import React from "react";
import { render } from "@testing-library/react";
import { AddressFormPage } from "..";

test("renders initially as loading", () => {
  const { getByText } = render(<AddressFormPage />);
  const linkElement = getByText(/Submit/i);
  expect(linkElement.className).toBe("button-loading");
});
