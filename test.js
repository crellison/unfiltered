var r = require('request');
var c = require('cheerio');

var list = ['tweets','following','followers']
// list = list.map(elt => `.ProfileNav-item--${elt}`)
var twitterStats = {}


r('https://twitter.com/realDonaldTrump', (err, resp, body) => {
  var listHTML = c(body).find('.ProfileNav-list');
  listHTML.children().each((i,child) => {
    if (i>3) return;
    var data = child.children[0].next.attribs.title.split(' ')
    data[0] = data[0].replace(',','');
    twitterStats[data[1]] = parseInt(data[0])
  })
  console.log(twitterStats)
})