# JPDB Progress Tracker

- This project retrieves the status of the Japanese vocabulary learning platform [JPDB](https://jpdb.io/) daily and builds an evolutionary chart of 'known' and 'learning' words.
- JPDB provides a 'daily activity' chart where the number of reviews and their results (number of 'failed', 'correct', 'new cards') are shown. \
However, it doesn't provide an evolutionary chart, which would allow you to see how far you've come. This is what this project aims to remedy.

- Uses GitHub actions to collect the status everyday, commit the new datapoint to this repo and publish a new github page version. \
See produced chart here: [GH Page](https://gustmmer.github.io/jpdb-progress/)

## Glossary
- 'Learning words': As JPDB uses SRS (Spaced Repetition System), words that are not yet mature according to the SRS system are classified as 'learning';
- 'Known words': Similarly, words that are considered mature enough are classified as 'known';


## About JPDB

- If you're interested in studying Japanese Vocab, I strongly recommend giving JPDB a try. Its main page makes a great job explaining its advantages.

- For the implications to this project and its resulting chart:
  -  JPDB sets 'known' words as 'learning' whenever it's time for them to be reviewed. \
This means that it's possible for the 'known' chart line to have some momentary drops. Of course, if failing the review, the word then stays in 'learning' for some time.
