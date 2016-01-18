var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');

var redisClient = redis.createClient(); //Requires redis server to be running already

var messages = [];

var storeMessage = function(name, data){
	var message = JSON.stringify({name:name, data:data});
	
	redisClient.lpush("messages", message, function(err, response){
		redisClient.ltrim("messages", 0, 9);
	});
	
	//The following code only stores messages while server is on
	/*
	messages.push({name:name, data:data});
	if(messages.length > 10){
		messages.shift();
	}
	*/
};

io.on('connection', function(client){			
	
	client.on('join', function(name){
		client.nickname = name;
		console.log(name + ' connected...');
		
		client.broadcast.emit("add chatter", name);
		
		redisClient.smembers('chatters', function(err, names){
			names.forEach(function(name){
				client.emit('add chatter', name);
			});
		});
		
		redisClient.sadd("chatters", name);
		
		redisClient.lrange("messages", 0, -1, function(err, messages){
			messages = messages.reverse();
			
			messages.forEach(function(message){
				message = JSON.parse(message);
				client.emit("messages", message.name + ": " + message.data);
			});
		});
		
		//The following code uses the non-persisting messages data stored while server is live
		/*
		messages.forEach(function(message){
			client.emit("messages", message.name + ": " + message.data);
		});
		*/
	});
	
	client.emit('messages', {hello: 'world'});
	
	client.on('messages',function (data){
		var nickname = client.nickname;
		console.log(nickname + " " + data);
		client.broadcast.emit('messages', nickname + " " + data);
		client.emit('messages', nickname + " " + data);
		storeMessage(nickname, data);
	});
		
	client.on('disconnect', function(name){
		client.broadcast.emit("remove chatter", client.nickname);
		redisClient.srem("chatters", client.nickname);
		console.log(client.nickname + ' disconnected...');
	});
});

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

server.listen(8080);