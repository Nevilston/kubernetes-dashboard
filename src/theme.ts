import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f",  // Red tone for primary
    },
    secondary: {
      main: "#1976d2",  // Blue for secondary actions
    },
    background: {
      default: "#f4f6f8",  // Light gray background for content area
    },
    text: {
      primary: "#2E2E2E",  // Dark text
      secondary: "#616161",  // Subtle gray text
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default theme;
