var azureStorage = require('azure-storage');
//var config = require('../azureconfig');
var path = require('path');
var http = require('https');
var fs = require('fs');
var shortid = require('shortid');

var IMG_CONTAINER_NAME = "images";
var ALBUM_CONTAINER_NAME = "albums";

var blobService;
if(process.env.NODE_ENV === 'production'){
	blobService = azureStorage.createBlobService();
}else{
	blobService = azureStorage.createBlobService('UseDevelopmentStorage=true;'); 
}

blobService.createContainerIfNotExists(IMG_CONTAINER_NAME, {
	publicAccessLevel: 'blob'
}, 
function(error, result, response){
	if(error) console.error(`Could not create Container ${IMG_CONTAINER_NAME}`,error);	
});

blobService.createContainerIfNotExists(ALBUM_CONTAINER_NAME, {
	publicAccessLevel: 'blob'
}, 
function(error, result, response){
	if(error) console.error(`Could not create Container ${ALBUM_CONTAINER_NAME}`,error);	
});

function upload(container, file, id){
	console.log(`Upload file: ${file}`);
	blobService.createBlockBlobFromLocalFile(
		container, path.join(id, path.basename(file)), file, 
		function(error, result, response) {
			if (!error) {
				// file uploaded
				console.log(`File uploaded: ${file}`);
			}else{
				console.error(error);
			}
		});
}

function uploadImage(file, id){
	upload(IMG_CONTAINER_NAME, file, id);
}

function uploadAlbum(file){
	upload(ALBUM_CONTAINER_NAME, file);
}

function downloadImage(url, id, callback){
	
	var tempFolder = path.join(__dirname, '../temp', id);
	fs.mkdirSync(tempFolder);
	
	var tempPath = path.join(tempFolder, path.basename(url));
	console.log('tempPath', tempPath);
	var file = fs.createWriteStream(tempPath);
	console.log('url', url);
	
	var request = http.get(url, function(response) {
		var stream = response.pipe(file);
		stream.on('finish', function () {
			callback(tempPath, url);	
		});
		// fs.unlinkSync(tempPath);
		// fs.rmdirSync(tempFolder);
	}).on('error', function(e){
		console.error(`Could not get file: ${url}`, e);
	});
}

function uploadImages(files, id){
	
	
	
	for(var i = 0; i < files.length; i++){
		downloadImage(files[i].link, id, function(file){
			uploadImage(file, id);
		});
	}
}

module.exports = {
	uploadImages:uploadImages
};