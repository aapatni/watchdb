import "./App.css";
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Watch from "./Watch";
import WatchCard from './WatchCard';
import WatchDetailsModal from './WatchDetailsModal';

function App() {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    let { data: watches, error } = await supabase.from("watches").select("*");

    if (error) console.log("error", error);
    else if (watches.length === 0) console.log("No watches found");
    else console.log("watches", watches);

    setWatches(watches); 
  };

  const [selectedWatch, setSelectedWatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (watch) => {
    setSelectedWatch(watch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <h1>Watch Database</h1>
      <div className="watch-cards-container">
        {watches.map((watch, index) => (
          <WatchCard key={index} watch={watch} onClick={handleCardClick} />
        ))}
      </div>
      {isModalOpen && (
        <WatchDetailsModal watch={selectedWatch} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
