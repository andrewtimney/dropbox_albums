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
	if(error) console.log(`Could not create Container ${IMG_CONTAINER_NAME}`,error);	
});

blobService.createContainerIfNotExists(ALBUM_CONTAINER_NAME, {
publicAccessLevel: 'blob'
}, 
function(error, result, response){
	if(error) console.log(`Could not create Container ${ALBUM_CONTAINER_NAME}`,error);	
});

function upload(container, file){
	blobService.createBlockBlobFromLocalFile(
		container, path.basename(file), file, 
		function(error, result, response) {
			if (!error) {
				// file uploaded
				console.log(`File uploaded: ${file}`);
			}
		});
}

function uploadImage(file){
	upload(IMG_CONTAINER_NAME, file);
}

function uploadAlbum(file){
	upload(ALBUM_CONTAINER_NAME, file);
}

function downloadImage(url){
	var ext = path.extname(url);
	var tempPath = path.join(__dirname, '../temp', shortid.generate() + ext);
	console.log('tempPath', tempPath);
	var file = fs.createWriteStream(tempPath);
	console.log('url', url);
	var request = http.get(url, function(response) {
		console.log(response);
		response.pipe(file);
	}).on('error', function(e){
		console.error(`Could not get file: ${url}`, e);
	});
}

function uploadImages(files){
	for(var i = 0; i < files.length; i++){
		downloadImage(files[i].link, function(file){
			console.log('downloaded', file);
			//uploadImage(file);
		});
	}
}


module.exports = {
	uploadImages:uploadImages
};