var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

//Fetching and parsing a web page
var pageToVisit = "https://www.medicinenet.com";
console.log("Visiting page " + pageToVisit);
request(pageToVisit, function(error, response, body){
    if(error){
        console.log("Error: " + error);
    }

    //check status code(200)
    console.log("Status code: " + response.statusCode);
    if(response.statusCode === 200) {
        //parse the document body
        var $ = cheerio.load(body);
        console.log("Page title: " + $('title').text());
    }

    collectInternalLinks();
});

//Parse and search for word
function searchForWord($, word){
    var bodyText = $('html > body').text();
    if(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1)
        return true;
    return false;
}

//Collecting links
function collectInternalLinks($){
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
        allRelativeLinks.push($(this).attr('href'));
    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function(){
        allAbsoluteLinks.push($(this).attr('href'));
    });

    console.log("Found " + allRelativeLinks.length + " relative links");
    console.log("Found " + allAbsoluteLinks.length + " absolute links");
}