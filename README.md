# Unfiltered

The tweets Donald Trump does not want you to see (along with those he has kept)

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

For this, we can use IFTTT and the new(ish) Maker mode. Link my twitter account to watch [@realDonaldTrump](https://twitter.com/realDonaldTrump) for new tweets. Each time one comes in, send the URI over to my app in an HTTP POST request, and let [request](https://www.npmjs.com/package/request) and [cheerio](https://www.npmjs.com/package/cheerio) get to work parsing the HTML as before. Cheerio's syntax is a bit different than vanilla jQuery, but some quick testing smooths everything out.

