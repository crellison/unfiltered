const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const _ = require('underscore');

const TweetModel = require('./models')

// ----------------------------------------------
// CONNECT TO DATABASE
// ----------------------------------------------

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var db = mongoose.connection;
db.once('open', () => console.log("DB Connected!"));

function initializeDB() {
  var tweets = require('./tweets.json');
  _.each(tweets, (value,key) => {
    var tweet = new TweetModel({
      HTMLtext: value.text,
      timestamp: value.timestamp,
      twitterID: value.twitterID,
      twitterLink: `https://twitter.com${value.path}`
    })
    tweet.save(err => err ? console.log(err) : console.log(`Tweet [${value.twitterID}] saved at ${new Date()}`))
  })
}



