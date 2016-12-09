const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const esh = require('express-status-helper');

var TweetModel = require('../models');
var twitterBase = /^https:\/\/twitter.com\/realDonaldTrump\/status\/\d+$/;

var router = express.Router();

router.post('/', function(req, res, next) {
  // proper body form
  if (!req.body.tweetURI || req.body.tweetURI.match(twitterBase).length !== 1) return esh(res,400,{message: 'Improper link format'});
  request(req.body.tweetURI, (err, resp, body) => {
    var tweetHTML = cheerio(body).find('.permalink-tweet-container .js-original-tweet')[0]
    var tweetDB = new TweetModel({
      HTMLtext: cheerio(cheerio(tweetHTML).find('.js-tweet-text-container')[0]).html().replace('href="/', 'href="https://twitter.com/'),
      twitterID: cheerio(tweetHTML).data('tweet-id'),
      twitterLink: cheerio(tweetHTML).data('permalink-path'),
      timestamp: new Date(new Date(cheerio(tweetHTML).find('.tweet-timestamp')[0].attribs.title.replace('-','')))
    })
    tweetDB.save(err => { // if not a validation error => then the document already exists
      if (err) {
        if (err.name === "ValidationError") return esh(res, 400);
        return esh(res, 422, {message: "Tweet already exists in database."})
      }
      esh(res,200)
    });
  });
})

module.exports = router;