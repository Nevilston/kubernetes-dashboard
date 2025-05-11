// src/App.tsx
import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import PodsView from "./pages/PodsView"; // Import PodsView

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pods" element={<PodsView />} /> {/* Added PodsView Route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
