var http = require('http');
	
var makeRequest = function(message){
	var options = {
		hostname: '127.0.0.1', 
		port: 8080, 
		path: '/', 
		method: 'POST'
	}

	var request = http.request(options, function(response){
		response.on('data',function (data){
			console.log(data.toString()); // logs response body
		});
	});
	
	request.on('error', (e) => {
		console.log('problem with request: ' + e.message);
	});
	
	request.write(message); //begins request
	request.end(); //finishes request
}

module.exports = makeRequest;