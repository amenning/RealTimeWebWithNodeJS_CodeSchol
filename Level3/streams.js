var http = require('http');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

http.createServer(function(request, response){
	
	//Streams Section 1: The following code will print out the incoming request text
		// To test, simply write curl -d 'text' http://localhost:8080
	//All the code below is the same as doing request.pipe(response); 
	/* 	
	request.on('readable', function(){
		var chunk = null;
		while(null !== (chunk = request.read())){
			response.write(chunk);
		}
	});
	request.on('end', function(){
		response.end();
	});  
	*/
	//request.pipe(response);
	
	
	//Streams Section 2: The following code will take one file and create a copy into a new file
		//Make sure readme.md file is in the same folder as js file
	/* 
	var file = fs.createReadStream("readme.md");
	var newFile = fs.createWriteStream("readme_copy.md");
	file.pipe(newFile); 
	*/
	
	//Streams Section 3: Upload a file
		//curl --upload-file readme.md http://localhost:8080
	/*
 	var newFile2 = fs.createWriteStream("readme_copy2.md");
	request.pipe(newFile2);
	request.on('end', function(){
		response.end('uploaded!');
	}); 
	*/
	
	//Streams Section 4: File Uploading Progress
	var newFile3 = fs.createWriteStream("readme_copy3.md");
	var fileBytes = request.headers['content-length'];
	var uploadedBytes = 0;
	request.on('readable', function(){
		var chunk = null;
		while(null !== (chunk = request.read())){
			uploadedBytes += chunk.length;
			var progress = (uploadedBytes / fileBytes) *100;
			response.write("progress: " + parseInt(progress, 10) + "%\n");
		}
	request.pipe(newFile3);
	});
	request.on('end', function(){
		response.end('uploaded!');
	}); 
	
}).listen(8080, '127.0.0.1');

console.log('Listening on port 8080...');
