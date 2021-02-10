import feedparser
import json
from tqdm import tqdm
deviantFeed = 'https://backend.deviantart.com/rss.xml?type=deviation&q=boost%3Apopular-all-time+in%3Adigitalart+tag%3Aanime'

imgs = {}
for i in tqdm(range(1)):
    feed = feedparser.parse(deviantFeed)
    for i in feed['entries']:
        try:
            imgs[i['title']] = {"url":i['media_content'][0]['url'],"height":i['media_content'][0]['height'],"width":i['media_content'][0]['width']}
        except KeyError:
            pass
    deviantFeed = [x for x in feed["feed"]["links"] if x["rel"] == "next"][0]["href"]

with open("out.json","w") as fi:
    fi.write(json.dumps(imgs,indent=4))
