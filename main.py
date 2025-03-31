import json
import os
import dotenv
import requests
import datetime

from scrape_vocab_status import parse_vocab_status


def fetch_vocab_status(sid):
    response = requests.get("https://jpdb.io/learn", cookies={"sid": sid})

    if response.status_code != 200:
        print("Failed to fetch the page:", response.status_code)
        return None

    print("Successfully fetched the page")
    parsed_vocab_status = parse_vocab_status(response.text)

    if not all(map(lambda v: v is not None, parsed_vocab_status.values())):
        print("Not all values were retrieved by parser. Please review")
        print(parsed_vocab_status)
        return None

    return parsed_vocab_status


def create_datapoint(current_vocab_status, time):
    return {'t': time, 'status': current_vocab_status}


def datapoint_append_to_file(dp, filename):
    with open(filename, mode="a") as f:
        f.write(json.dumps(dp) + '\n')


if __name__ == '__main__':
    if os.getenv("ENV", "dev") == "dev":
        dotenv.load_dotenv()

    vocab_status = fetch_vocab_status(os.getenv("JPDB_SID"))
    if vocab_status is None:
        exit(1)

    now = datetime.datetime.now().replace(microsecond=0).isoformat()
    datapoint = create_datapoint(vocab_status, now)

    datapoint_append_to_file(datapoint, "gh-page/datapoints.txt")
