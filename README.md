# Sid's Jokes

## Rationale

I'm very fond my terrible jokes. I started a [Twitter](http://twitter.com/sidsjokes)
account to share said terrible jokes. Because I keep myself signed into my personal Twitter
account, I wanted a way to automatically post the jokes I found, and figured it'd be a fun
project.

## How It Works

There's two parts to this project: a website and a Chrome Extension.

### Web

Can be found [here](http://captainsidd.com/sidsJokes).
Posts the inputted data to Firebase, and the server.js file runs in the
background to tweet the joke in the early morning hours so everyone sees my terrible
sense of humor.

### Chrome Extension

Can be found [here](https://chrome.google.com/webstore/detail/sids-jokes/kjgjbokkjalcjfdkbhcnnfbcdlampefl).
Posts the inputted data to Firebase, and the server.js file runs in the
background to tweet the joke in the early morning hours so everyone sees my terrible
sense of humor. Yes, this is the same server.js file as the web version. No, it's not bundled
with the Chrome Extension files.

## Installation & Setup

The Chrome Extension files are found in the `chrome` folder, or in the `chrome` branch. To
develop with, simply follow Google's guide to adding your own extensions to Chrome.

The web version is everything else on the `master` branch. The actual website itself is
hosted by GitHub pages, so `gh-pages` is the branch that contains files being served.
The backend code is handled by simply starting `server.js` in pm2 or forever, and it'll do its
job.
