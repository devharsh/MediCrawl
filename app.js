const express = require("express");
const app = express();
const request = require('request');

// var solrClient = require('solr-node');
// var solr = require('solr-client');

// var options = new solrClient({
//     host: '127.0.0.1',
//     port: '8983',
//     path: '/solr/',
//     core: 'nutch',
//     protocol: 'http'
// });

// var client = solr.createClient();

// client.add({id:12, title_t:'Hello'}, function(err, obj){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log('Solr response: ', obj);
//     }
// })


app.get('/', (req, res) => {
    //var search = req.body.params;
    //var strQuery = options.query().q('cancer');

    //request("https://www.fanlab.me/#people",
    request("http://localhost:8983/solr/nutch/select?q=cancer&fl=url,title",
    //client.search(strQuery, 
    function(error, response, body){
        console.error('Error: ', error);
        res.status(200).send(body);
    });
    
});

app.listen(3000,() => {
    console.log("We've got a server now!");
    console.log("Your routes will be running on http://localhost:3000");
});