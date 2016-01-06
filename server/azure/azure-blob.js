var azureStorage = require('azure-storage');
var path = require('path');
var request = require('request');
var fs = require('fs');
var shortid = require('shortid');
var Promise = require('bluebird');

var IMG_CONTAINER_NAME = "images";

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
		if(error) console.error('Could not create Container '+IMG_CONTAINER_NAME,error);
	});


function download(url){
	return new Promise(function(resolve, reject){
			resolve(request.get(url));
	});
}

function upload(filePath, folder){
	return new Promise(function(resolve, reject){
		blobService.createBlockBlobFromLocalFile(
			IMG_CONTAINER_NAME, path.join(folder, path.basename(filePath)), filePath,
			function(error, result, response){
				if(error) {
					console.error('Upload', error);
					reject(error);
				}
				resolve(result);
			});
	});
}

function uploadStream(stream, filepath){
	return new Promise(function(resolve, reject){
		var writeStream = blobService.createWriteStreamToBlockBlob(
			IMG_CONTAINER_NAME, filepath, {},
		function(er, result, response){
			if(er){
				console.error(er);
				reject(er);
			}else{
				resolve(result);
			}
		});
		stream.pipe(writeStream);
	});
}

function getImages(id){
	return new Promise(function(resolve, reject){
		blobService.listBlobsSegmentedWithPrefix(IMG_CONTAINER_NAME, id, null, function(error, result, response){
			if(error) reject(error);
			resolve(result);
		});
	});
}

module.exports = {
	getImages: getImages,
	createBlobUrl: function(file){
		//http://127.0.0.1:10000/devstoreaccount1/images
		if(process.env.NODE_ENV === 'production'){
			return 'http://dropboxdropbox.blob.core.windows.net/'+IMG_CONTAINER_NAME+'/'+file;
		}else{
			return 'http://127.0.0.1:10000/devstoreaccount1/'+IMG_CONTAINER_NAME+'/'+file;
		}
	},
	download: download,
	upload: upload,
	uploadStream: uploadStream
};
