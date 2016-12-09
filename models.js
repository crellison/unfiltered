const mongoose = require('mongoose');
const request  = require('request');

var tweetSchema = mongoose.Schema({
  HTMLtext: {
    type: String,
    required: true
  },
  twitterID: {
    type: Number,
    required: true,
    unique: true
  },
  twitterLink: {
    type: String,
    required: false // tweet may have been deleted
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  timestamp: {
    type: Date,
    required: true,
    unique: true
  }
});

tweetSchema.index({timestamp: 1});

// check tweets from the last week to see if any have been deleted
// if they have, update the db object
tweetSchema.statics.checkWeek = function(cb) {
  var lastWeek = new Date(new Date().setDate(new Date().getDate()-7))
  this.model('Tweet').find({timestamp : {$gte : lastWeek}}).then((tweets,err) => {
    if (err) return console.log(`Unable to check tweets. Encountered a ${err.name}.`)
    console.log(`Updating ${tweets.length} tweets`);
    var completed = 0;
    tweets.map((tweet,i) => {
      request(tweet.twitterLink, (err,resp) => {
        if (resp.statusCode === 404) tweet.set({deleted: true});
        tweet.save(err => {
          if (err) console.log(`Unable to update tweet [${tweet.twitterID}]. Encountered a ${err.name}.`);
          // else console.log(`No change in tweet [${tweet.twitterID}]`);
        }).then(() => {
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

module.exports = mongoose.model('Tweet',tweetSchema);