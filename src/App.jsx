import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios"; // Maybe we'll need axios? 🤔
import "./style.css";

const GIPHY_API_KEY = "ktJr7BVC2NkuHL6VwDNNFoBwRRZeWgQl";

const App = () => {
  const [gifs, setGifs] = useState([]);

  async function fetchData() {
    const data = await axios.get(
      `http://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}`,
    );
    const gifData = data.data.data;
    setGifs(gifData);
    console.log(gifData);
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="app">
      <h1 className="title">Let's Make Some API Requests!</h1>
      {gifs.map((gifObject) => (
        <img key={gifObject.url} src={gifObject.images.original.url} />
      ))}
    </div>
  );
};


// The following lines initialize your React application and inject
// it into the index.html
const root = createRoot(document.getElementById("root"));
root.render(<App />);