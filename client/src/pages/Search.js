import React, { useState } from "react";

const Search = ({ onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Kullanıcının arama girdisi

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      // API'den rehber verilerini getir
      const response = await fetch(`/api/guides?search=${searchTerm}`);
      const data = await response.json();
      onSearchResults(data); // Arama sonuçlarını üst bileşene ilet
    } catch (error) {
      console.error("Arama hatası:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rehber ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Ara</button>
    </div>
  );
};

export default Search;
