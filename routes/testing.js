const cheerio = require('cheerio');
const request = require('request');

request('https://twitter.com/realDonaldTrump/status/807057700857188355', (err, resp, body) => {
  var tweetHTML = cheerio(body).find('.permalink-tweet-container .js-original-tweet')[0]
  console.log(new Date(cheerio(tweetHTML).find('.tweet-timestamp')[0].attribs.title.replace('-','')))
  // var tweetDB = new TweetModel({
  //   HTMLtext: cheerio(cheerio(tweetHTML).find('.js-tweet-text-container')[0]).html().replace('href="/', 'href="https://twitter.com/'),
  //   twitterID: cheerio(tweetHTML).data('tweet-id'),
  //   twitterLink: cheerio(tweetHTML).data('permalink-path'),
  //   timestamp: new Date(cheerio(tweetHTML).find('.content .tweet-timestamp')[0].title.replace('-',''))
  // })
  // tweetDB.save(err => err ? esh(res, 503) : esh(res,200));
})