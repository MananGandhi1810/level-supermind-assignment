from instagrapi import Client
import os
import pandas as pd
import json
import dotenv

dotenv.load_dotenv()

ACCOUNT_USERNAME = os.environ.get("ACCOUNT_USERNAME")
ACCOUNT_PASSWORD = os.environ.get("ACCOUNT_PASSWORD")

cl = Client()
cl.login(ACCOUNT_USERNAME, ACCOUNT_PASSWORD)


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
            "media_type",
            "product_type",
            "comment_count",
            "like_count",
            "play_count",
            "caption_text",
            "usertags",
            "video_url",
            "view_count",
            "video_duration",
            "username",
            "location_name",
        ]
    ]
    print(media.head)
    return media


collect_data("neurotechh")
