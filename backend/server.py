from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
import json
from server.model import predict_n_animes


app = Flask(__name__, template_folder="templates")

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def index():
  return "Welcome to the Weeb Tree API",200


@app.route("/etl")
@cross_origin()
def etl():
    return render_template("anime_etl.html")
    
@app.route("/predict", methods=["GET"])
@cross_origin()
def predict():
    genres = request.args.get("genres")
    rating = request.args.get("rating")
    episodes = request.args.get("episodes")
    anime_type = request.args.get("anime_type")
    neighbors = request.args.get("neighbors")

    # sanitize data and check if query parameters exist and are valid
    if not genres or not episodes or not neighbors or not anime_type or not rating:
        return {"Status" : "Missing required URL parameters to run prediction model"}, 422

    # convert appropriate and validate bounds
    try:
        episodes = int(episodes)
        rating = float(rating)  
        neighbors = int(neighbors)
        
        if episodes < 0:
            return {"Status" : "Parameter episodes need to be a positive whole number"}, 400

        if rating < 0 or rating > 10:
            return {"Status" : "Parameter rating need to be a floating point value in the range of [0,10]"}, 400
        
        if neighbors not in range(1,11):
            return {"Status" : "Parameter neighbors must be between 1 and 10"}, 400

    except ValueError:
        return {"Status": "At least one of the numeric parameters was not the correct type"}, 400

    prediction_data = {
        "genres" : genres.split(","),
        "rating" : rating,
        "episodes" : episodes,
        "anime_type" : anime_type        
    }

    results = predict_n_animes(prediction_data, neighbors)

    return results,200
    

@app.route("/data",methods=["GET"])
@cross_origin()
def genres():
    with open("./backend/data/misc.json","r") as file:
        data = json.loads(file.read())
    
    return data, 200

