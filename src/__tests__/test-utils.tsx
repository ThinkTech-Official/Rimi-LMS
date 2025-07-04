import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/i18";
import React from "react";
import { MemoryRouter } from "react-router-dom";

// Wrap component with all needed providers
const AllProviders = ({ children }: { children: React.ReactNode }) => (
 <MemoryRouter>
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  </MemoryRouter>
);

// Override default render
const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
