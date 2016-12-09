# Unfiltered

The tweets Donald Trump does not want you to see (along with those he has kept)

## Backstory

My initial desire for this was born from the realization that our President-Elect is (rather often) inclined to divulge his true feelings over Twitter. Some of these are then removed due to their \*ahem\* controversial tone or outright bigotry. I believe that we should know what our President is thinking. For this reason, I have created this separate repository of his Twitter data since 7 November 2016. I began recording new tweets on 8 December, so this site has no data on deleted tweets from before that data.

I set this up in a few hours using NodeJS, Express, and MongoDB on a Heroku server. I thought that this README could serve as a blog-style posting with a walkthrough of my process.

## Step One: Recover Initial Tweets for Database Seed

The first part is fairly straightforward. I just had to load a bunch of tweets on the page by triggering pagination with scrolling (I went to 7 Nov 2016, since it seemed like a reasonable date), then dig through some HTML with jQuery parsing. This is completely possible to do with the `document.getElementsByClass` due to Twitter's site construction, but the ease of jQuery is hard to beat. The last piece is a deciding which information from the tweet is important. I figured that likes, shares, responses, retweets, etc. were unnecessary, as I was only after time and content. An important piece of this project is to refer to the original to see if it still exists, so some Twitter IDs seemed pertinent.

```javascript
// Getting Tweets from Twitter Page

var tweets = {}; // catch-all object for tweet info

$('.tweet.original-tweet').each((i, tweet) => {
  tweets[i] = {};
  tweets[i].path = $(tweet).data('permalink-path'); // link on twitter
  tweets[i].twitterID = $(tweet).data('tweet-id'); // ID for verification
  // parse the timestamp from twitter's version
  tweets[i].timestamp = new Date($(tweet).find('.content .tweet-timestamp')[0].title.replace('-','')); 
  // grab the text, hashtags, and links in the ugly mess that it is
  tweets[i].text = $(tweet).find('.js-tweet-text-container')[0].innerHTML.replace('href="/', 'href="https://twitter.com/'); 
})

console.save(tweets,tweets.json); // this method is borrowed (see below)
```

> The `console.save` function is taken from [this](http://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file) Stack Overflow article, and has proved rather helpful in the past.

From here, all you have to do is pump the JSON into your DB with the proper shape and you are golden to begin.

## Step Two: Setting up the Webhook

For this, I used IFTTT and the new(ish) Maker mode. Link my twitter account to watch [@realDonaldTrump](https://twitter.com/realDonaldTrump) for new tweets. Each time one comes in, send the URI over to my app in an HTTP POST request, and let [request](https://www.npmjs.com/package/request) and [cheerio](https://www.npmjs.com/package/cheerio) get to work parsing the HTML as before. Cheerio's syntax is a bit different than vanilla jQuery, but some quick testing smooths everything out.

```javascript
// regex to match only strings that are links to Donald Trump tweets
var twitterBase = /^https:\/\/twitter.com\/realDonaldTrump\/status\/\d+$/;

router.post('/', function(req, res, next) {
  // proper body form
  if (!req.body.tweetURI || req.body.tweetURI.match(twitterBase).length !== 1) 
    return esh(res,400,{message: 'Improper link format'});
  request(req.body.tweetURI, (err, resp, body) => {
    // grab the new tweet HTML from the response body
    var tweetHTML = cheerio(body).find('.permalink-tweet-container .js-original-tweet')[0]
    var tweetDB = new TweetModel({ // create new DB object
      HTMLtext: cheerio(cheerio(tweetHTML).find('.js-tweet-text-container')[0]).html().replace('href="/', 'href="https://twitter.com/'),
      twitterID: cheerio(tweetHTML).data('tweet-id'),
      twitterLink: cheerio(tweetHTML).data('permalink-path'),
      // note twitter's annoying date format
      timestamp: new Date(new Date(cheerio(tweetHTML).find('.tweet-timestamp')[0].attribs.title.replace('-','')))
    })
    tweetDB.save(err => { 
      // if not a validation error => then the document already exists
      if (err) {
        if (err.name === "ValidationError") return esh(res, 400);
        return esh(res, 422, {message: "Tweet already exists in database."})
      }
      esh(res,200)
    });
  });
})
```

## Step Three: Heroku Scheduler

I still needed to be able to check my database against what is still available on twitter. Thankfully, Heroku, my cloud server of choice, has a simple scheduler that makes quick work of this task. A quick run in the console of `heroku addons:create scheduler:standard`. Since I am working in NodeJS, it would be easier for me to run a node script. Heroku Scheduler runs a bash-style command with bin as the root, so I created `/bin/checkTweets` with `#!/usr/bin/env node` as the top line to say that I was working in a node environment.

From there, I needed to make my checking method, which would go through all tweets I saved from the last week and check if any had been deleted. This meant a mongoose time query to get the target tweets, and then looping through to check if any had been changed. I made this as a static Mongoose method so I could use it again if need be.

```javascript
tweetSchema.statics.checkWeek = function(cb) { 
  // arrow function binding changes how `this` functions
  // date object one week prior to "now"
  var lastWeek = new Date(new Date().setDate(new Date().getDate()-7))
  this.model('Tweet').find({timestamp : {$gte : lastWeek}}).then((tweets,err) => {
    if (err) return console.log(`Unable to check tweets. Encountered a ${err.name}.`)
    console.log(`Updating ${tweets.length} tweets`);
    var completed = 0;
    tweets.forEach((tweet,i) => { // GET request to the tweet URI
      request(tweet.twitterLink, (err,resp) => { // if 404 => the tweet is deleted
        if (resp.statusCode === 404) tweet.set({deleted: true});
        tweet.save(err => {
          if (err) console.log(`Unable to update tweet [${tweet.twitterID}]. Encountered a ${err.name}.`);
          // else console.log(`No change in tweet [${tweet.twitterID}]`);
        }).then(() => {
          // promise workaround to execute the callback when everything is done
          completed++;
          if (completed === tweets.length) {
            console.log('all tweets checked');
            cb()
          }
        });
      });
    });
  });
};
```

I set up the scheduler to open a connection with the DB and call this function once each day from the `/bin/checkTweets` file.

## Step Four: Website

Coming soon...