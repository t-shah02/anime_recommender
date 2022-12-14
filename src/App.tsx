import React from 'react';
import { Grid, Typography, Slider, Button, Box, TextField, Checkbox, FormControlLabel, FormGroup, Fade } from "@mui/material";
import { useState, useEffect } from "react";
import GenreSelect from "./components/GenreSelect";
import AnimeCard from "./components/AnimeCard";
import LinearProgress from '@mui/material/LinearProgress';
import { Prediction, PredictionAPIResponse, WordMapping } from './types';
import "./App.css";

function App() {

  const BASE_API_URL = "https://anime-recommender-tan.herokuapp.com";

  // define states
  const [score, setScore] = useState<number>(5);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [numberOfRecommendations, setNumberOfRecommendations] = useState<number>(5);
  const [keywords, setKeywords] = useState<string>("");
  const [propKeywords, setPropKeywords] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [useGenres, setUseGenres] = useState<boolean>(true);
  const [useScore, setUseScore] = useState<boolean>(true);
  const [useKeywords, setUseKeywords] = useState<boolean>(true);
  const [wordMapping, setWordMapping] = useState<WordMapping>({});

  // define API functions 
  async function fetchGenres(): Promise<void> {
    const response = await fetch(`${BASE_API_URL}/genres`);
    const genres: string[] = await response.json();

    setAllGenres(genres);

  }

  const createPredictionEndpointURL = () => {
    let currentURL = `${BASE_API_URL}/predict?`;

    if (useGenres) {
      currentURL = `${currentURL}genres=${selectedGenres.join(",")}&`
    }

    if (useScore) {
      currentURL = `${currentURL}score=${score}&`
    }

    if (useKeywords) {
      currentURL = `${currentURL}synopsis=${keywords}&`
    }

    currentURL = `${currentURL}num_recs=${numberOfRecommendations}`;
    return currentURL;
  }

  async function fetchPredictions(): Promise<void> {

    setPredictions([]);

    const PREDICTION_URL = createPredictionEndpointURL();

    setLoading(true);
    const response = await fetch(PREDICTION_URL);
    const data: PredictionAPIResponse = await response.json();
    const predictions: Prediction[] = data.results.predictions;
    const mappings: WordMapping = data.results.word_mappings;

    setLoading(false);
    setPredictions(predictions);
    setPropKeywords(keywords);
    setWordMapping(mappings);
  }


  // component event functions 
  const handleSliderScoreChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setScore(newValue);
    }
  };

  const handleKeywordsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(event.target.value);
  };


  const handleSliderNumberOfRecommendationsChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setNumberOfRecommendations(newValue);
    }
  };


  const resetCheckBoxes = () => {
    setUseGenres(true);
    setUseScore(true);
    setUseKeywords(true);
  }

  useEffect(() => {
    fetchGenres();
  }, []);




  return (
    <div className="App">

      <div className="title-container">
        <h1>Anime Recommender</h1>
        <p>All suggestions are sourced from MyAnimeList</p>
      </div>
      {!useGenres && !useScore && !useKeywords ?
        <Grid xs={4} item display="flex" flexDirection="column" alignItems="center">
          <Typography color="white" id="non-linear-slider" gutterBottom>
            At least one of the states of either genres, score or keywords/synopsis needs to be enabled to make predictions!
          </Typography>
          <Button onClick={resetCheckBoxes} sx={{ marginTop: "10px" }} variant="contained" color="error">
            RESET STATES
          </Button>
        </Grid>
        :
        <Grid sx={{ width: "100%" }} container justifyContent="center" alignItems="center" direction="column">
          <Grid xs={8} item
            display="flex"
            alignItems="center"
            flexDirection="column">

            <FormGroup>
              <FormControlLabel sx={{ color: "white" }}
                control={<Checkbox sx={{ color: "white", "&.Mui-checked": { color: "#40ff00" } }} onChange={() => setUseGenres((prev) => !prev)} checked={useGenres} />}
                label="Use selected genres in predictions" />
            </FormGroup>

            <Fade in={useGenres}>
              <div>
                <GenreSelect
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                  allGenres={allGenres}
                />
              </div>

            </Fade>


          </Grid>

          <Grid xs={4} item display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: "5px" }}>
            <FormGroup>
              <FormControlLabel sx={{ color: "white" }}
                control={<Checkbox sx={{ color: "white", "&.Mui-checked": { color: "#40ff00" } }} onChange={() => setUseScore((prev) => !prev)} checked={useScore} />}
                label="Use score in predictions" />
            </FormGroup>

            <Fade in={useScore}>
              <Typography color="white" id="non-linear-slider" gutterBottom>
                Score: {score}
              </Typography>

            </Fade>

            <Fade in={useScore}>
              <Slider color="secondary" onChange={handleSliderScoreChange} sx={{ width: 300 }} defaultValue={5} valueLabelDisplay="auto" step={0.01} min={1} max={10} />
            </Fade>

          </Grid>

          <Grid xs={4} item display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: "15px" }}>
            <FormGroup>
              <FormControlLabel sx={{ color: "white" }}
                control={<Checkbox sx={{ color: "white", "&.Mui-checked": { color: "#40ff00" } }} onChange={() => setUseKeywords((prev) => !prev)} checked={useKeywords} />}
                label="Use keywords/synopsis description in predictions" />
            </FormGroup>
            <Fade in={useKeywords}>
              <TextField
                onChange={handleKeywordsChange}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                sx={{
                  color: "white",
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(228, 219, 233, 0.25)',
                  },
                  width: 300
                }}
                rows={3} multiline label="Enter some keywords" id="fullWidth" />
            </Fade>
          </Grid>

          <Grid xs={4} item display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: "15px" }}>
            <Typography color="white" id="non-linear-slider" gutterBottom>
              Number of Recommendations: {numberOfRecommendations}
            </Typography>
            <Slider color='primary' onChange={handleSliderNumberOfRecommendationsChange} sx={{ width: 300 }} defaultValue={5} valueLabelDisplay="auto" step={1} min={1} max={10} />
          </Grid>

          <Grid xs={4} item display="flex" flexDirection="column" alignItems="center">
            <Button onClick={fetchPredictions} sx={{ marginTop: "25px" }} variant="contained" color="success">
              GET SUGGESTIONS
            </Button>
          </Grid>

          {loading ? <Box sx={{ width: '300px', marginTop: "25px" }}>
            <LinearProgress />
          </Box> : null}


        </Grid>
      }


      {predictions.length && useKeywords ? 
        <Grid xs={4} item display="flex" flexDirection="row" justifyContent="center" sx={{ marginTop: "5px", flexWrap: "wrap" }}>

            <Typography color="white" id="prop-keywords" gutterBottom>
              Best matches for: {propKeywords}
            </Typography>
        </Grid>
        :
        null}

      {predictions.length ?  
        <Grid xs={4} item display="flex" flexDirection="row" justifyContent="center" sx={{ marginTop: "5px", flexWrap: "wrap" }}>
          {predictions.map((prediction: Prediction, index: number) => {
            return <AnimeCard key={index} keywords={propKeywords} wordMapping={wordMapping} {...prediction} />
          })}
        </Grid>
        : 
        null}

    </div>
  );
}

export default App;
