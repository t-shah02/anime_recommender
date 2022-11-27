import pandas as pd
import numpy as np
from joblib import load
from bs4 import BeautifulSoup as Soup
import requests
from server.db.handle import *




# load the dataset and select feature set
ANIME_DF = pd.read_csv("./server/data/cleaned_anime.csv")
X = ANIME_DF.drop(["anime_id","name","genre","type"],axis=1)

# unique anime types to number map
unique_types = ANIME_DF.type.unique()
TYPE_MAP = {unique_type : index for index,unique_type in enumerate(unique_types)}


BASE_URL = "https://myanimelist.net/anime/"


def generate_prediction_vector(anime_type, episodes, rating, genres):
    
    n = len(X.columns)
    GENRE_VECTOR_MAP = {genre : 0 for genre in X.columns[2:n-1]}  
    
    for genre in genres:
        GENRE_VECTOR_MAP[genre] = 1

    return np.array([episodes, rating] + list(GENRE_VECTOR_MAP.values()) + [TYPE_MAP[anime_type]]) 


def scrape_mal(anime_id):
    url = f"{BASE_URL}/{anime_id}/"

    response = requests.get(url)
    soup = Soup(response.content,"html.parser") 

    image_url = soup.find("meta", property="og:image")["content"]
    description = soup.find("meta", property="og:description")["content"]

    return image_url, description


def get_anime_json(indices):
    results = []

    for index in indices:
        anime_data = ANIME_DF.iloc[index]
        name = anime_data["name"]
        episodes = int(anime_data["episodes"])
        anime_type = anime_data["type"]
        rating = float(anime_data["rating"])
        genres = anime_data["genre"]
        anime_id = int(anime_data["anime_id"])
    
        # query the pgsql db to see if it exists, to prevent http request in scrape_mal

        result = select_from_anime_table(anime_id)
        
        if result:
            image_url, description = result
        else:
            image_url, description = scrape_mal(anime_id)
            insert_into_anime_table(anime_id,image_url, description)
        
        result = {
            "anime_id" : anime_id,
            "name" : name,
            "episodes" : episodes,
            "anime_type" : anime_type,
            "rating" : rating,
            "genres" : genres,
            "image_url" : image_url,
            "description" : description
        }

        results.append(result)

    return results



def predict_n_animes(user_prediction_data, n):
    anime_type, episodes, rating, genres = user_prediction_data["anime_type"], user_prediction_data["episodes"], user_prediction_data["rating"], user_prediction_data["genres"]

    if n not in range(1,11): return False
    
    model = load(f"./server/models/neighbors{n}.pkl")
    prediction_vector = generate_prediction_vector(anime_type, episodes, rating, genres)
    
    distances, indices = model.kneighbors([prediction_vector])
    results = get_anime_json(indices[0])

    return results


