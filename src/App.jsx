import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios"; // Maybe we'll need axios? 🤔
import "./style.css";

const GIPHY_API_KEY = "ktJr7BVC2NkuHL6VwDNNFoBwRRZeWgQl";

const App = () => {
  const [gifs, setGifs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchData() {
    const data = await axios.get(
      `http://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}`,
    );
    const gifData = data.data.data;
    setGifs(gifData);
    console.log(gifData);
  }
  async function fetchBasedOnSearch() {
    const data = await axios.get(
      `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${GIPHY_API_KEY}`,
    );
    const gifData = data.data.data;
    setGifs(gifData);
    console.log(gifData);
  }
  function handleClick(event) {
    event.preventDefault();
    setSearchTerm(event.target[0].value);
  }
  function sortGifs(event) {
    console.log(event.target.value);
    let newArr = [];
    if (event.target.value !== "default") {
      newArr = gifs.sort((a, b) => {
        a = new Date(a.import_datetime);
        b = new Date(b.import_datetime);
        return event.target.value === "newest" ? b - a : a - b;
      });
    }

    setGifs([...newArr]);
  }

  useEffect(() => {
    if (searchTerm === "") {
      fetchData();
    } else {
      // fetchBasedOnSearch();
    }
  }, [searchTerm]);

  return (
    <div className="app">
      <h1 className="title">Let's Make Some API Requests!</h1>
      <form onSubmit={handleClick}>
        <input type="text" />
        <button type="submit">Search</button>
      </form>
      <select name="sort" id="sort" onChange={sortGifs}>
        <option defaultValue="default">--Sort--</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <div>
        {gifs.map((gifObject) => (
          <div className="gif-card">
            <img key={gifObject.url} src={gifObject.images.original.url} />
          </div>
        ))}
      </div>
    </div>
  );
};

// The following lines initialize your React application and inject
// it into the index.html
const root = createRoot(document.getElementById("root"));
root.render(<App />);
