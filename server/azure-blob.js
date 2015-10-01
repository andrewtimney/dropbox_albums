var azureStorage = require('azure-storage');
//var config = require('../azureconfig');
var path = require('path');

var IMG_CONTAINER_NAME = "images";
var ALBUM_CONTAINER_NAME = "albums";

var blobService;

if(process.env.NODE_ENV === 'production'){
	blobService = azureStorage.createBlobService('UseDevelopmentStorage=true;');
}else{
	blobService = azureStorage.createBlobService(); 
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


module.exports = {};