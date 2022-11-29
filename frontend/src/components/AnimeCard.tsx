import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import DescriptionDialogue from './DescriptionDialogue';
import Link from '@mui/material/Link';

export default function AnimeCard({ anime_id, anime_type, name, description, image_url, genres, episodes, rating }: {
    anime_id: number,
    anime_type: string,
    name: string,
    description: string,
    image_url: string,
    genres: string,
    episodes: number,
    rating: number,
}) {

    const MAL_URL = `https://myanimelist.net/anime/${anime_id}`;

    return (
        <Card sx={{ margin : "20px", width: 345 }}>
            <CardMedia
                component="img"
                alt={`${name} prediction`}
                height="200"
                image={image_url}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    <Link href={MAL_URL}>{name}</Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Rating: {rating}
                    <br/>
                    Episodes: {episodes}
                    <br/>
                    Anime Type: {anime_type}
                    <br/>
                    Genres : {genres}
                </Typography>
            </CardContent>
            <CardActions>
                <DescriptionDialogue name={name} description={description}/>
            </CardActions>
        </Card>
    );
}