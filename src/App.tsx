import React from 'react';
import { Grid, Typography, Slider, TextField, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import GenreSelect from "./components/GenreSelect";
import AnimeTypeSelect from "./components/AnimeTypeSelect";
import AnimeCard from "./components/AnimeCard";
import LinearProgress from '@mui/material/LinearProgress';
import "./App.css";

function App() {



  const BASE_API_URL = "https://tan-anime-recommender.herokuapp.com/";

  // define validation and input processing Functions

  const isNumber = (numberStr: string): boolean => isNaN(parseInt(numberStr)) ? false : true;


  //  define types 
  interface GenreAndAnimeTypes {
    genres: string[],
    types: string[]
  }

  interface Prediction {
    anime_id: number,
    anime_type: string,
    name: string,
    description: string,
    image_url: string,
    genres: string,
    episodes: number,
    rating: number,
  }

  // define states
  const [rating, setRating] = useState<number>(1);
  const [neighbors, setNeighbors] = useState<number>(1);
  const [episodes, setEpisodes] = useState<number>(1);
  const [selectedAnimeType, setSelectedAnimeType] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [allAnimeTypes, setAllAnimeTypes] = useState<string[]>([]);
  const [invalidEpisodeCount, setInvalidEpisodeCount] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // define API functions 
  async function fetchAllGenresAndAnimeTypes(): Promise<void> {
    const response = await fetch(`${BASE_API_URL}/data`);
    const data: GenreAndAnimeTypes = await response.json();

    const genres = data.genres;
    const types = data.types;

    setAllGenres(genres);
    setAllAnimeTypes(types);

  }

  async function fetchPredictions(): Promise<void> {
    if (!selectedAnimeType.length || !selectedGenres.length || invalidEpisodeCount) return;

    const PREDICTION_URL = `${BASE_API_URL}/predict?rating=${rating}&episodes=${episodes}&anime_type=${selectedAnimeType}&genres=${selectedGenres.join(",")}&neighbors=${neighbors}`

    setLoading(true);
    const response = await fetch(PREDICTION_URL);
    const predictions: Prediction[] = await response.json();
    setLoading(false);
    setPredictions(predictions);
  }


  // component event functions 
  const handleSliderRatingChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setRating(newValue);
    }
  };

  const handleSliderNeighborsChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setNeighbors(newValue);
    }
  };

  const handleEpisodeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replaceAll("-", "");

    if (!isNumber(value)) {
      setInvalidEpisodeCount(true);
      return;
    }

    setEpisodes(parseInt(value));
    setInvalidEpisodeCount(false);
    event.target.value = value;
  };

  useEffect(() => {
    fetchAllGenresAndAnimeTypes();
  }, []);


  return (
    <div className="App">

      <div className="title-container">
        <h1>Anime Recommender</h1>
        <p>All suggestions are sourced from MyAnimeList</p>
      </div>

      <Grid container justifyContent="center" alignItems="center" direction="column">
        <Grid xs={8} item
          display="flex"
          justifyContent="center"
          flexDirection="column">

          <GenreSelect
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            allGenres={allGenres} />

        </Grid>
        <Grid xs={4} item>
          <AnimeTypeSelect
            allAnimeTypes={allAnimeTypes}
            selectedAnimeType={selectedAnimeType}
            setSelectedAnimeType={setSelectedAnimeType} />
        </Grid>
        <Grid xs={4} item display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: "5px" }}>
          <Typography color="white" id="non-linear-slider" gutterBottom>
            Rating: {rating}
          </Typography>
          <Slider color="secondary" onChange={handleSliderRatingChange} sx={{ width: 300 }} valueLabelDisplay="auto" step={0.01} min={1} max={10} />
        </Grid>

        <Grid xs={4} item display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: "5px" }}>
          <Typography color="white" id="non-linear-slider" gutterBottom>
            Number of Recommendations: {neighbors}
          </Typography>
          <Slider color='primary' onChange={handleSliderNeighborsChange} sx={{ width: 300 }} valueLabelDisplay="auto" step={1} min={1} max={10} />
        </Grid>
        <TextField
          error={invalidEpisodeCount}
          helperText={invalidEpisodeCount ? "Positive whole number required!" : ""}
          onChange={handleEpisodeInputChange}
          sx={{
            marginTop: "20px", input: { color: "white" },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(228, 219, 233, 0.25)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(228, 219, 233, 0.25)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(228, 219, 233, 0.25)',
            },
            '.MuiSvgIcon-root ': {
              fill: "white !important",
            }
          }}
          InputLabelProps={{
            style: { color: '#fff' }
          }}
          id="outlined-basic" label="Episode count" variant="outlined" />
        <Button onClick={fetchPredictions} sx={{ marginTop: "25px" }} variant="contained" color="success">
          GET SUGGESTIONS
        </Button>
        {loading ? <Box sx={{ width: '300px', marginTop: "25px" }}>
          <LinearProgress />
        </Box> : null}
        <Grid xs={4} item display="flex" flexDirection="row" justifyContent="center" alignItems="center" sx={{ marginTop: "5px", flexWrap: "wrap" }}>
          {predictions.map((prediction: Prediction) => {
            return <AnimeCard {...prediction} />
          })}
        </Grid>

      </Grid>


    </div>
  );
}

export default App;
