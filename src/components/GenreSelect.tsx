import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const INPUT_LABEL = "Pick your genres";
const INPUT_LABEL_COLOR = "white";
const CHIP_BG_COLOR = "rgb(49,62,75)";


function getStyles(genre: string, selectedGenres : readonly string[], theme: Theme) {
    return {
        fontWeight:
            selectedGenres.indexOf(genre) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
        
    };
}

export default function MultipleSelectChip({ allGenres, selectedGenres, setSelectedGenres } : 
    { allGenres : string[], selectedGenres : string[], setSelectedGenres : React.Dispatch<React.SetStateAction<string[]>> }) {
    
    const theme = useTheme();
    const handleChange = (event: SelectChangeEvent<typeof selectedGenres>) => {
        const {
            target: { value },
        } = event;


        setSelectedGenres(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div>
            <FormControl sx={{alignSelf : "center", m: 1, width: 300 }}>
                <InputLabel sx={ {color : INPUT_LABEL_COLOR} } id="demo-multiple-chip-label">
                    {INPUT_LABEL}
                </InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedGenres}
                    onChange={handleChange}
                    input={ <OutlinedInput label={INPUT_LABEL} />}
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
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip variant="filled" 
                                    sx={ {backgroundColor : CHIP_BG_COLOR ,color : "white"} } 
                                    key={value} 
                                    label={value} 
                                />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {allGenres.map((genre) => (
                         <MenuItem
                            key={genre}
                            value={genre}
                            style={getStyles(genre, selectedGenres, theme)}
                        >
                            {genre}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}