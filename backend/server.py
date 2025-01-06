from flask import Flask, request, jsonify
from instagrapi import Client
import os
import pandas as pd
import dotenv
import pickle
from astrapy import DataAPIClient
import asyncio
from flask_cors import CORS

dotenv.load_dotenv()

ACCOUNT_USERNAME = os.environ.get("ACCOUNT_USERNAME")
ACCOUNT_PASSWORD = os.environ.get("ACCOUNT_PASSWORD")
ASTRA_DB_TOKEN = os.environ.get("ASTRA_DB_TOKEN")
app = Flask(__name__)
cors = CORS(app)


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
username_collection = db.get_collection("uploaded_usernames")


async def collect_data(username):
    username_collection.insert_one({"username": username, "status": "processing"})
    user = cl.user_info_by_username_v1(username)
    raw_medias = cl.user_medias(user.pk)
    media = [x.model_dump() for x in raw_medias]
    if len(media) == 0:
        username_collection.delete_one({"username": username})
        return
    media = pd.DataFrame({k: [x[k] for x in media] for k in media[0]})
    media["username"] = media.apply(lambda x: x.user["username"], axis=1)
    media["location_name"] = media.apply(
        lambda x: x.location.get("name") if x.location else "", axis=1
    )
    user_data = media[
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
    username_collection.update_one({"username": username}, {"status": "uploaded"})


@app.get("/scrape")
def scrape():
    username = request.args.get("username")
    if not username:
        return jsonify({"success": False})

    if username in db.list_collection_names():
        return jsonify({"success": True})

    if username_collection.find_one({"username": username}):
        return jsonify({"success": True})

    asyncio.run(collect_data(username))
    return jsonify({"success": True})


@app.get("/status")
def status():
    username = request.args.get("username")
    if not username:
        return jsonify({"success": False, "status": None})

    if username in db.list_collection_names():
        return jsonify({"success": True, "status": "uploaded"})

    if username_collection.find_one({"username": username}):
        return jsonify({"success": True, "status": "processing"})

    return jsonify({"success": False, "status": None})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081)
