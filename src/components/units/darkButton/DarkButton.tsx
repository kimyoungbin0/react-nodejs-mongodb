import React from "react";
import { ThemeModeWrapper } from "./DarkButton.style";

export const ThemeModeButton = ({ toggleTheme, themeMode }) => {
  return <ThemeModeWrapper onClick={toggleTheme}>{themeMode === "lightTheme" ? "🌝" : "🌚"}</ThemeModeWrapper>;
};
