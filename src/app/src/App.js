import "./App.css";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import Sidebar from "./components/Sidebar";
import { createRoot } from "react-dom/client";
import { DataProvider } from "./services/SharedDataContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { initGA, logPageView } from "./services/analytics";
import theme from "./services/theme";

function App() {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);
  return (
    <DataProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ backgroundColor: theme.palette.background.default }}>
          <Sidebar />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
    </DataProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
export default App;
