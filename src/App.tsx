// src/App.tsx
import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {/* <Route path="/pods" element={<PodsPage />} />
          <Route path="/nodes" element={<NodesPage />} />
          <Route path="/deployments" element={<DeploymentsPage />} />
          <Route path="/cost-optimization" element={<CostOptimizationPage />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
