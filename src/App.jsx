import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./style.css";

const GIPHY_API_KEY = "oWKslpvWj6o4YW0EURA4kZ7cJ7wtfQ8k";

const App = () => {
  const [gifs, setGifs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  async function fetchTrending() {
    try {
      const { data } = await axios.get(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}`
      );
      setGifs(data.data);
    } catch (error) {
      console.error("Error fetching trending gifs:", error);
    }
  }

  async function fetchBasedOnSearch(term) {
    if (!term.trim()) return;
    try {
      const { data } = await axios.get(
        `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
          term
        )}&api_key=${GIPHY_API_KEY}`
      );
      setGifs(data.data);
    } catch (error) {
      console.error("Error fetching search gifs:", error);
    }
  }

  async function fetchBasedOnRandom() {
    try {
      const { data } = await axios.get(
        `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}`
      );
      setGifs([data.data]);
    } catch (error) {
      console.error("Error fetching random gif:", error);
    }
  }

  useEffect(() => {
    fetchTrending();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const inputValue = event.target.elements.searchInput.value.trim();
    setSearchTerm(inputValue);
    if (inputValue !== "") {
      fetchBasedOnSearch(inputValue);
    } else {
      fetchTrending();
    }
  }

  function sortGifs(event) {
    const value = event.target.value;
    setSortOrder(value);

    if (value === "default") {
      if (searchTerm === "") {
        fetchTrending();
      } else {
        fetchBasedOnSearch(searchTerm);
      }
      return;
    }

    const sortedGifs = [...gifs].sort((a, b) => {
      const dateA = new Date(a.import_datetime);
      const dateB = new Date(b.import_datetime);
      return value === "newest" ? dateB - dateA : dateA - dateB;
    });
    console.log("Sorted GIFs:", sortedGifs);
    setGifs(sortedGifs);
  }

  return (
    <div className="app">
      <h1 className="title"> Gifts!</h1>
      <button onClick={fetchTrending}>Trending GIFs</button>
      <button onClick={() => fetchBasedOnRandom(searchTerm)}>Random GIF</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <select name="sort" id="sort" onChange={sortGifs} value={sortOrder}>
        <option value="default">Regular</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <div>
        {gifs.map((gifObject) => (
          <div key={gifObject.id}>
            <img className="gif-card" src={gifObject.images.original.url} alt={gifObject.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
