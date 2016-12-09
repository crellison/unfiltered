window.twitter = {}

twitter.mountStatic = function() {}

twitter.mount = function() {
  // empty and refill board

  $('textarea').focus(function() {
    $(this).css('height','5em')
    $('.collapse').collapse('toggle')
  })
  $('textarea').blur(function() {
    $(this).css('height','2.5em')
    $('.collapse').collapse('toggle')
  })
  $('#submit').off()
  $('#submit').click(function(e) {
    e.preventDefault();
    console.log('clicked')
    var temp2 = document.getElementById("tweet").value;
    window.temp2 = temp2;
    $('.collapse').collapse('toggle')
    document.getElementById("tweet").value = ''
    $(this).css('height','2.5em')
    window.tweets.addTweet(temp2)
  })

  $(document).ready(function() {
      var text_max = 140;
      $('#charcount').html(text_max);

      $('#tweet').keyup(function() {
          var text_length = $('#tweet').val().length;
          var text_remaining = text_max - text_length;
          $('#charcount').html(text_remaining);
      });
  });
}
twitter.PostList = function() {
  this.posts = []
}

twitter.PostList.prototype = {
  addTweet: function(textbody) {
    this.posts.push(textbody)
    this.renderTweet(textbody)
  },
  getTweets: function() {return this.posts},
  renderTweet: function(textbody) {
    textbody = textbody.trim()
    if (textbody.length > 80) {
      textbody = textbody.slice(0,80).trim()+'...'
    }
    var wrapperTweet = $('<div class="post"></div>')
    var insidethebox = $('<div style="display:flex"></div>')
    var avatar = $('<img src="aybabu.jpg">')
    var tweetInfo = $('<div style="padding-left:5px"></div>')
    var tweetTop = $('<div class="date" id="twitterInfo">'+(new Date(Date.now())).getDay()+' Jun</div>\
          <div id="twitterInfo"><b>Zero Wing</b> @allyourbasearebelongtous</div>')
    var tweetBody = $('<p class="tweetText">'+textbody+'</p>')
    var tweetFooter = $('<p class="expand" href="#">Expand</p>')

    wrapperTweet.append(insidethebox)
    insidethebox.append(avatar)
    insidethebox.append(tweetInfo)
    tweetInfo.append(tweetTop)
    tweetInfo.append(tweetBody)
    tweetInfo.append(tweetFooter)
    $('#madTweets').prepend(wrapperTweet)
  },
}