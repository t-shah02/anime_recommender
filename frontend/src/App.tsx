import React from 'react';
import { Slider } from "@mui/material";
import { useState, useEffect } from "react";


function App() {

  const BASE_API_URL = "https://tan-anime-recommender.herokuapp.com/";

  const [rating, setRating] = useState<number>(1);
  const [episodes, setEpisodes] = useState<number>(1);
  const [animeType, setAnimeType] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>();



  // useEffect(() => {
  //     const response = await fetch("")
  // },[]);


  return (
    <div className="App">
      <Slider
        size="small"
        defaultValue={70}
        aria-label="Small"
        valueLabelDisplay="auto"
      />
    </div>
  );
}

export default App;
