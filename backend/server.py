from flask import Flask, request, jsonify
from instagrapi import Client
import os
import pandas as pd
import dotenv
import pickle
from astrapy import DataAPIClient

dotenv.load_dotenv()

ACCOUNT_USERNAME = os.environ.get("ACCOUNT_USERNAME")
ACCOUNT_PASSWORD = os.environ.get("ACCOUNT_PASSWORD")
ASTRA_DB_TOKEN = os.environ.get("ASTRA_DB_TOKEN")

app = Flask(__name__)

cl = None

if os.path.isfile("account.pkl"):
    f = open("account.pkl", "rb")
    cl = pickle.load(f)
    f.close()
else:
    cl = Client()
    cl.login(ACCOUNT_USERNAME, ACCOUNT_PASSWORD)
    with open("account.pkl", "wb") as f:
        pickle.dump(cl, f)

client = DataAPIClient(ASTRA_DB_TOKEN)
db = client.get_database_by_api_endpoint(
    "https://76def820-552c-4b62-a2de-db7646bb920a-us-east1.apps.astra.datastax.com"
)


def collect_data(username):
    user = cl.user_info_by_username_v1(username)
    raw_medias = cl.user_medias(user.pk)
    media = [x.model_dump() for x in raw_medias]
    media = pd.DataFrame({k: [x[k] for x in media] for k in media[0]})
    media["username"] = media.apply(lambda x: x.user["username"], axis=1)
    media["location_name"] = media.apply(
        lambda x: x.location.get("name") if x.location else "", axis=1
    )
    media = media[
        [
            "taken_at",
            "product_type",
            "comment_count",
            "like_count",
            "play_count",
            "caption_text",
            "view_count",
            "username",
            "location_name",
        ]
    ]
    return media


@app.get("/scrape")
def scrape():
    username = request.args.get("username")
    if not username:
        return jsonify({"success": False})
    user_data = collect_data(username)

    user_data = user_data.to_dict(orient="records")
    collection = db.create_collection(username)

    collection.insert_many(
        [
            {
                "taken_at": x["taken_at"],
                "product_type": x["product_type"],
                "comment_count": x["comment_count"],
                "like_count": x["like_count"],
                "play_count": x["play_count"],
                "caption_text": x["caption_text"],
                "view_count": x["view_count"],
                "username": x["username"],
                "location_name": x["location_name"],
            }
            for x in user_data
        ],
    )
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True)
