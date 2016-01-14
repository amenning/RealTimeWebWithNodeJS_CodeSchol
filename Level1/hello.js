var http = require('http');

http.createServer(function(request, response){
	response.writeHead(200);
	response.write("Hello, this is dog.");
	response.end();
}).listen(8080, '127.0.0.1');

console.log('Listening on port 8080...');