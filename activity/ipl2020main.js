let path = require("path");
let request = require("request");
let cheerio = require("cheerio");
let singleTeam = require("./singleTeam")

var fs = require('fs');
var dir = path.join(__dirname, 'ipl2020');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}


request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results", cb);


function cb(error, response, html) {
    // console.log(response);
    // console.log("error",error);
    // console.log(html);
    let cheerioSelector = cheerio.load(html);
    // // element select 
    let matchcard = cheerioSelector(".col-md-8.col-16");
    // console.log(matchcard[0]);
    for (let i = 0; i < matchcard.length; i++) {
        let anchorsofAMatch = cheerioSelector(matchcard[i])
            .find(".match-score-block .match-info-link-FIXTURES").attr("href");
        let fullLink = "https://www.espncricinfo.com" + anchorsofAMatch;
        console.log(fullLink);
        // singlemathFileObj.spFn(fullLink);
        singleTeam.fn(fullLink);

    }
    //   let AllAnchors = cheerioSelector('.match-cta-container .btn.btn-sm.btn-outline-dark.match-cta ');
    // console.log(element.length);
    // console.log(element.html());
    // html 
    // console.log(element.html());
    // text
    // console.log(element.text());
}