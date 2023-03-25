const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const nedb = require('nedb');
const urlEncodedParser = bodyParser.urlencoded({extended: true});

let database = new nedb({
    filename: 'database.txt',
    autoload: true
});

let app = express();

app.use(express.static('public'));
app.use(urlEncodedParser);
app.set('view engine', 'ejs');

app.get ("/", function (request,response){
    response.render('index.ejs', {})
});

app.get('/leaderboard', function(request, response){
    let query = {};
    
    let sortQuery = {
        score: -1
    }
    database.find(query)
        .sort(sortQuery)
        .exec(function(error,data){
            console.log(data)
        response.render('leaderboard.ejs', {messages: data });
    })
})


app.post('/upload', function(request,response){
    console.log(request.body);

    var currentDate = new Date();
    let data = {
        name: request.body.name,
        score: request.body.score,
        date: currentDate.toLocaleString(),
        timestamp: currentDate.getTime()
    }

    //nedb
    database.insert(data, function(error, newData){
        console.log(newData);
        response.redirect('/leaderboard');
    })
})


// Routes HTTP GET requests to the specified path with the specified callback functions.
app.get('/test', function(request, response) { 
    response.send("Test: Server is working") 
})

app.listen(8000, function() {
    console.log("App listening on port 8000")
})


