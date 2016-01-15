var http = require('http');
var EventEmitter = require('events').EventEmitter;

http.createServer(function(request, response){
	response.writeHead(200);
	response.write("Hello, this is dog.");
	response.end();
}).listen(8080, '127.0.0.1');

console.log('Listening on port 8080...');

var logger = new EventEmitter();

logger.on('error', function(message){
	console.log('ERR: ' + message);
});

logger.emit('error', 'Spilled Milk');
logger.emit('error', 'Eggs Cracked');