const request = require('request');
const cheerio = require('cheerio');

/*

Getting Tweets from Twitter Page

var tweets = {};

$('.tweet.original-tweet').each((i, tweet) => {
  tweets[i] = {};
  tweets[i].path = $(tweet).data('permalink-path');
  tweets[i].twitterID = $(tweet).data('tweet-id');
  tweets[i].timestamp = new Date($(tweet).find('.content .tweet-timestamp')[0].title.replace('-',''));
  tweets[i].text = $(tweet).find('.js-tweet-text-container')[0].innerHTML.replace('href="/', 'href="https://twitter.com/');
})

console.save(tweets,tweets.json);

*/