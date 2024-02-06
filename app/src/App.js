import "./App.css";
import React from "react";
import { supabase } from "./supabaseClient";
import NavBar from "./NavBar";
import FilterInput from "./FilterInput";
import WatchGrid from "./WatchGrid";
import { createRoot } from 'react-dom/client';
import { DataProvider } from "./SharedDataContext";


function App() {
  return (
    <DataProvider>
      <div className="App">
        <NavBar /> {}
        <div>
          <FilterInput supabase={supabase} />
        </div>
        <div className="watch-cards-container">
          <WatchGrid supabase={supabase} />
        </div>
      </div>
    </DataProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
export default App;
