import "./App.css";
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import NavBar from "./NavBar";
import SearchFilter from "./SearchFilter";
import WatchGrid from "./WatchGrid"


function App() {
  const [searchParameters, setSearchParameters] = useState("");
  
  const handleDataFromFilter = (data) => {
    setSearchParameters(data);
  }

  const [watches, setWatches] = useState([]);

  useEffect(() => {
    const fetchWatches = async () => {
      let { data: watches, error } = await supabase.from("watches").select("*");

      if (error) console.log("error", error);
      else if (watches.length === 0) console.log("No watches found");
      else console.log("num watches: ", watches.length);
      setWatches(watches);
    };

    fetchWatches();
  }, []);

  return (
    <div className="App">
      <NavBar /> {}
      <div>
        <SearchFilter supabase={supabase} handleDataFromFilter={handleDataFromFilter} />
      </div>
      <div className="watch-cards-container">
        <WatchGrid watches={watches}/>
      </div>
    </div>
  );
}

export default App;
