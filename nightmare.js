const async = require('async');
const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const urls = ["https://www.youtube.com/watch?v=ahXOaHv9XYo", "https://www.youtube.com/watch?v=U8XF6AFGqlc", "https://www.youtube.com/watch?v=dIiwFzFvsmw",
"https://www.youtube.com/watch?v=4QrGCSse1_8", "https://www.youtube.com/watch?v=aqAajTpzK3o"];
let comments = {};

console.time("Run time: ");

async.eachLimit(urls, 5, (item, cb) => {
  comments[item] = [];
  let nightmare =  new Nightmare()
  .useragent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36')
  .goto(item)
  .wait(".comment-renderer-text-content")
  .evaluate(() => {
    return document.body.innerHTML;
  })
  .end()
  .then((data) => {
    data = cheerio.load(data);
    let comment = data('.comment-renderer-text-content').each((i, v) => {
      return comments[item].push(v.children[0].data);
    });
    return cb();
  })
  .catch((err) => {
    throw new Error(err);
  });

}, (err) => {
  if(err) throw new Error(err);
  console.log(comments);
  console.timeEnd("Run time: ");
});
