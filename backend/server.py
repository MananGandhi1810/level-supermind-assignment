from flask import Flask, request, jsonify
from instagrapi import Client
import os
import pandas as pd
import dotenv
import pickle

dotenv.load_dotenv()

ACCOUNT_USERNAME = os.environ.get("ACCOUNT_USERNAME")
ACCOUNT_PASSWORD = os.environ.get("ACCOUNT_PASSWORD")

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
    print(user_data.head())
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True)
