// define types

export interface Prediction {
    mal_id: number,
    name: string,
    score: number,
    synopsis: string,
    picture_url: string,
    genres: string,
    similarity_score: number | undefined,
}

export interface WordMapping {
    [index: string]: string
}

export interface PredictionAPIResponse {
    status: string,
    results: {
        predictions: Prediction[],
        word_mappings: WordMapping
    }
}