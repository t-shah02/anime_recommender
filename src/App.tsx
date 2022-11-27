import React from 'react';
import { useState } from 'react';
import { Button } from "@mui/material";
import "./App.css";

function App() {

  const [genres, setGenres] = useState([]);

  type Numset = Set<number>;

  const numbers : Numset = new Set();

  async function fetchGenres() {
    const response = await fetch("http://localhost:8080/genres");
    const data = await response.json();
    setGenres(data.genres);
  }


  return (
    <div className="App">
      <button onClick={fetchGenres}>Test</button>
      <h1 className="test">Test</h1>
      <Button>adad</Button>
      { genres.map((genre, index) => {
          return <h1>{genre}</h1>
      })}
    </div>

  );
}

export default App;
