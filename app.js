const express = require("express");
const app = express();
const request = require('request');


app.get('/', (req, res) => {
    var search = req.body.params;
    search = toLowerCase(str.replace(/\s+/g, ''));

    //var strQuery = options.query().q('cancer');

    request("http://localhost:8983/solr/nutch/select?q=search&fl=url,title",
    function(error, response, body){
        console.error('Error: ', error);
        res.status(200).send(body);
    });
    
});

app.listen(3000,() => {
    console.log("We've got a server now!");
    console.log("Your routes will be running on http://localhost:3000");
});