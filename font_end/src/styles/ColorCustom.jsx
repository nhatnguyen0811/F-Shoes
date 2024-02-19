import { createTheme } from "@mui/material";

export const ColorCustom = createTheme({
  palette: {
    neutral: {
      main: "#202020",
      contrastText: "#fff",
    },
    red: {
      main: "red",
      contrastText: "#fff",
    },
    gray: {
      main: "#808080",
      contrastText: "#fff",
    },
  },
});
