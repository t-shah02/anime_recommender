import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const INPUT_LABEL = "Pick the anime type";
const INPUT_LABEL_COLOR = "white";

export default function AnimeTypeSelect({ allAnimeTypes, selectedAnimeType , setSelectedAnimeType} : 
    { allAnimeTypes : string[], selectedAnimeType : string, setSelectedAnimeType : React.Dispatch<React.SetStateAction<string>> }) { 
    

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedAnimeType(event.target.value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width : 300 }}>
                <InputLabel sx={ {color: INPUT_LABEL_COLOR}} id="demo-simple-select-autowidth-label">{INPUT_LABEL}</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selectedAnimeType}
                    onChange={handleChange}
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
                        '.MuiSvgIcon-root ': {
                          fill: "white !important",
                        }
                      }}
                    autoWidth
                    label={INPUT_LABEL}
                >
                    {allAnimeTypes.map((animeType, index) => {
                        return <MenuItem key={index} value={animeType}>{animeType}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </div>
    );
}