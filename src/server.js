var express        =        require("express");
var bodyParser     =        require("body-parser");
var app            =        express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('port', (process.env.PORT || 8080));

app.get('/', function(req, res) {
    res.sendFile("/index.html", {"root": __dirname});
});

app.use('/', express.static(__dirname, + '/'));

//Listening for Server
app.listen(app.get('port'),function(){
    console.log("Started on port ", app.get('port'));
});
