/**
  * Node Server script
  **/
 //Requiring node modules
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var router = express.Router();
var port = process.env.PORT || '3000';
var config = require('./config/config.js');

//Mongo db connection
var mongoose   = require('mongoose');
mongoose.connect(config.mongo_url);

// adding middleware
app.use(express.static('.'));
app.use(express.static('./app/views'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({'extended':'false'}));
app.get('/',function(req,res){
    res.redirect('main.html');
});

//Sockets for each client connection
io.sockets.on('connection', function (socket) {		
    console.log('user connected');
    socket.on('disconnect',function(msg){
        console.log('user disconnected');
    });
	require('./app/routes.js')(app,router,socket,io);
});
server.listen(port, function(){
	console.log("Application is running on "+port);
});
