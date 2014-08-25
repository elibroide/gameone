// server.js
// Eliezer Eyal Broide

var ip = "http://127.0.0.1";
var port = 3000;

// requiring needed modules
var socket = require('socket.io');
var express = require('express');
var http = require('http');
// getting app and server
var app = express(ip);
var server = http.createServer(app);
server.listen(port, function(err){
	if(err){
		console.log('Not listening ' + err);
	}
	console.log('Start listening http');
});
// socket
var io = socket.listen(server);
var sockets = io.sockets;

// Serve static files
app.use('/game', express.static(__dirname + "/Game/www")); 
// Redirect to the chat.html page
app.get("/", function(req, res){
  	res.sendFile(__dirname + "/index.html");
});

io.on('connection', function (socket) {
	socket.emit('connected');
	var name;
	socket.on('message', function (data) {
		if (!name){
			socket.emit('disconnected');
    		return;
    	}
		console.log("message: " + name + ": " + data.text);
		sockets.in('chatroom').emit('message', { name: name, text: data.text });
    });
    socket.on('username', function(data){
    	if(name){
    		return;
    	}
    	name = data.name;
		console.log("username: " + name);
		socket.emit('message', { name: 'System', text: 'Hi ' + name + '!' });
		socket.join('chatroom');
		socket.to('chatroom').emit('message', { name: 'System', text: name + ' has connected!' });
    });
    socket.on('disconnect', function(){
        console.log(name + ' has disconnected');
        sockets.in('chatroom').emit('userDisconnected', { name: name });
    });
});