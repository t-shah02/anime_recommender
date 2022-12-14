import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import DescriptionDialogue from './DescriptionDialogue';
import Link from '@mui/material/Link';
import { WordMapping } from "../types";


export default function AnimeCard({ keywords,wordMapping ,mal_id, name, synopsis , picture_url , genres, score, similarity_score }: {
    keywords : string,
    wordMapping : WordMapping
    mal_id: number,
    name: string,
    synopsis: string,
    picture_url: string,
    genres: string,
    score: number,
    similarity_score: number | undefined
}) {

    const MAL_URL = `https://myanimelist.net/anime/${mal_id}`;

    return (
        <Card sx={{ margin : "20px", width: 345 }}>
            <CardMedia
                component="img"
                sx = {{ backgroundPosition : "center" }}
                alt={`${name} prediction`}
                height="400"
                image={picture_url}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    <Link href={MAL_URL}>{name}</Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Score: {score}
                    <br/>
                    Genres : {genres}
                    <br/>
                    Similarity Score : {similarity_score !== undefined ? `${Number(similarity_score * 100).toFixed(2)}%` : "N/A"}
                </Typography>
            </CardContent>
            <CardActions>
                <DescriptionDialogue keywords={keywords} wordMapping={wordMapping} name={name} description={synopsis}/>
            </CardActions>
        </Card>
    );
}