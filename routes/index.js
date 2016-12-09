var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // load this data with call from page (REST style)
  var twitterData = {title: '@realDonaldTrump'}
  request('https://twitter.com/realDonaldTrump', (err, resp, body) => {
    var listHTML = cheerio(body).find('.ProfileNav-list');
    listHTML.children().each((i,child) => {
      if (i>3) return;
      var data = child.children[0].next.attribs.title.split(' ')
      data[0] = data[0].replace(/,/g,'');
      console.log(data)
      twitterData[data[1]] = parseInt(data[0])
    })
    console.log(twitterData)
    res.render('index', twitterData);
  })
});

module.exports = router;
