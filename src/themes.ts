import { createTheme } from "@mui/material";

export const themeLight = createTheme({
  palette: {
    background: {
      default: "#e4f0e2",
    },
  },
});

export const themeDark = createTheme({
  palette: {
    background: {
      default: "#03021b",
    },
    text: {
      primary: "#ffffff",
    },
  },
});
