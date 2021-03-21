let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
var fs = require('fs');

// input -> full scorecard page url 
function singleMatch(url) {

    request(url, cb);
}

function cb(error, response, html) {
    let chSelector = cheerio.load(html);
    // console.log(chSelector);
    let bothMatches = chSelector(".event .teams>.team");
    let winningTeam;
    let lossingTeam;
    let winningTeamIdx;
    let lossingTeamIdx;
    if (chSelector(bothMatches[0]).hasClass("team-gray")) {
        lossingTeam = chSelector(bothMatches[0]).find(".name-detail a").text();
        winningTeam = chSelector(bothMatches[1]).find(".name-detail a").text();
        winningTeamIdx = 1;
        lossingTeamIdx = 0;
    }
    else {
        lossingTeam = chSelector(bothMatches[1]).find(".name-detail a").text();
        winningTeam = chSelector(bothMatches[0]).find(".name-detail a").text();
        winningTeamIdx = 0;
        lossingTeamIdx = 1;
    }
    // console.log(winningTeam,lossingTeam);
    // both block [MI block,DC block]
    let colInnings = chSelector(".Collapsible");
    let winningTeamHtml = chSelector(colInnings[winningTeamIdx]);
    let lossingTeamHtml = chSelector(colInnings[lossingTeamIdx]);
    printTeamStats(winningTeamHtml, lossingTeamHtml, chSelector, winningTeam.toUpperCase().trim(), lossingTeam.toUpperCase().trim());

}
function printTeamStats(winningTeamHtml, lossingTeamHtml, chSelector, winningTeam, lossingTeam) {
    let overallMatchInfo = chSelector(".match-info.match-info-MATCH .description").text().split(",");

    //all this will be same for entire match
    let venue = overallMatchInfo[1].trim().toUpperCase();
    let date = overallMatchInfo[2].trim().toUpperCase();
    let result = chSelector(".match-info.match-info-MATCH .status-text").text().trim().toUpperCase();

    //winning team info

    //making file path for winning team
    var dir = path.join(__dirname, 'ipl2020');
    var dir = path.join(dir, winningTeam);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let allRowsWinning = chSelector(winningTeamHtml)
        .find(".table.batsman tbody tr");

    //processing winning team data
    for (let j = 0; j < allRowsWinning.length; j++) {
        let eachbatcol = chSelector(allRowsWinning[j]).find("td");
        if (eachbatcol.length == 8) {
            let playerName = chSelector(eachbatcol[0])
                .text().toLowerCase().trim();
            let filePath = path.join(dir, playerName + ".json")

            //check if player's .json exists or not

            if (!fs.existsSync(filePath)) {
                //file exists
                let arr = [];
                let contentinfile = JSON.stringify(arr);
                fs.writeFileSync(filePath, contentinfile);
            }

            //selecting fields

            let runs = chSelector(eachbatcol[2]).text();
            let balls = chSelector(eachbatcol[3]).text();
            let fours = chSelector(eachbatcol[5]).text();
            let sixes = chSelector(eachbatcol[6]).text();
            let strikeRate = chSelector(eachbatcol[7]).text();


            //updating json file content of that player

            let content = fs.readFileSync(filePath);
            let arr = JSON.parse(content);
            arr.push({
                Runs: runs,
                Balls: balls,
                Fours: fours,
                Sixes: sixes,
                StrikeRate: strikeRate,
                Opponent: lossingTeam,
                Venue: venue,
                MatchDate: date,
                Result: result
            })
            let contentinfile = JSON.stringify(arr);
            fs.writeFileSync(filePath, contentinfile);
        }
    }

    //losing team info

    //making path for losing team
    var dir = path.join(__dirname, 'ipl2020');
    var dir = path.join(dir, lossingTeam);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let allRowsLossing = chSelector(lossingTeamHtml)
        .find(".table.batsman tbody tr");

    //processing lossing team data
    for (let j = 0; j < allRowsLossing.length; j++) {
        let eachbatcol = chSelector(allRowsLossing[j]).find("td");
        if (eachbatcol.length == 8) {
            let playerName = chSelector(eachbatcol[0])
                .text().toLowerCase().trim();
            let filePath = path.join(dir, playerName + ".json")

            //check if player's .json exists or not

            if (!fs.existsSync(filePath)) {
                //file exists
                let arr = [];
                let contentinfile = JSON.stringify(arr);
                fs.writeFileSync(filePath, contentinfile);
            }

            //selecting fields

            let runs = chSelector(eachbatcol[2]).text();
            let balls = chSelector(eachbatcol[3]).text();
            let fours = chSelector(eachbatcol[5]).text();
            let sixes = chSelector(eachbatcol[6]).text();
            let strikeRate = chSelector(eachbatcol[7]).text();


            //updating json file content of that player

            let content = fs.readFileSync(filePath);
            let arr = JSON.parse(content);
            arr.push({
                Runs: runs,
                Balls: balls,
                Fours: fours,
                Sixes: sixes,
                StrikeRate: strikeRate,
                Opponent: winningTeam,
                Venue: venue,
                MatchDate: date,
                Result: result
            })
            let contentinfile = JSON.stringify(arr);
            fs.writeFileSync(filePath, contentinfile);
        }
    }




}

// singleMatch("https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-sunrisers-hyderabad-qualifier-2-1237180/full-scorecard")
module.exports = {
    fn: singleMatch
}