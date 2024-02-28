import "./App.css";
import React from "react";
import { supabase } from "./services/supabaseClient";
import Sidebar from "./components/Sidebar";
import Search from "./components/Search";
import { createRoot } from "react-dom/client";
import { DataProvider } from "./services/SharedDataContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ThemeProvider } from "@mui/material/styles";

import theme from "./services/theme";


function App() {
  return (
    <DataProvider>
      <ThemeProvider theme={theme}>
          <Sidebar />
        <Router>

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ThemeProvider>

      
    </DataProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
export default App;
