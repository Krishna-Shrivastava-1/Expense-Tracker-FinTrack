// components/theme-provider.jsx
"use client";

import * as React from "react";
// Import directly from the updated package
import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
