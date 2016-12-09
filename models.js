const mongoose = require('mongoose');

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

module.exports = mongoose.model('Tweet',tweetSchema);