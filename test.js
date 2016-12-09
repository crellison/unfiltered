var r = require('request');

r('https://twitter.com/crykerellison/status/807242500574498816', (err, resp) => {
  console.log(resp.statusCode)
})