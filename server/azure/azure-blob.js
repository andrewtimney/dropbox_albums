var azureStorage = require('azure-storage');
var path = require('path');
var request = require('request');
var fs = require('fs');
var shortid = require('shortid');
var Promise = require('bluebird');

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

function upload(container, file, album){
	return new Promise(function(resolve, reject){
		blobService.createBlockBlobFromLocalFile(
			container, path.join(album.id, path.basename(file)), file, 
			function(error, result, response) {
				if (!error) {
					fs.unlinkSync(file);
					album.azureFiles.push(decodeURI(result.replace('\\', '/')));
					resolve(result);
				}else{
					console.error(error);
					reject(error);
				}
			});
	});
}

function uploadImage(file, album){
	return upload(IMG_CONTAINER_NAME, file, album);
}

function uploadAlbum(file){
	upload(ALBUM_CONTAINER_NAME, file);
}

function downloadImage(url, album){
	return new Promise(function(resolve, reject){
		var tempFolder = path.join(__dirname, '../temp', album.id);
		try{
			fs.mkdirSync(tempFolder);
		}catch(err){
			console.log('Folder exists, deal with it');
		}
		
		var tempPath = path.join(tempFolder, path.basename(url).replace('%', '-'));
		var fileStream = fs.createWriteStream(tempPath);
		console.log(`tempPath: ${tempPath}, url: ${url}`);
		
		//var proxy = request.defaults({'proxy':'http://127.0.0.1:8888'});
		request.get(url)
			.on('response', 
				function(response) {
					var stream = response.pipe(fileStream);
					stream.on('finish', function () {
						resolve({ tempPath: tempPath, url: url });	
					});
				})
			.on('error', reject);
	});
}

function uploadImages(files, album){
	var promises = [];
	for(var i = 0; i < files.length; i++){
		promises.push(downloadImage(files[i].link, album)
			.then(function(file){
				return uploadImage(file.tempPath, album);
			})
		);
	}
	return Promise.all(promises)
		.then(function(){
			console.log('remove folder ${album.id}');
			//fs.rmdirSync(path.join(__dirname, '../temp', album.id));
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
	uploadImages: uploadImages,
	getImages: getImages,
	createBlobUrl: function(file){
		//http://127.0.0.1:10000/devstoreaccount1/images
		if(process.env.NODE_ENV === 'production'){
			return 'http://dropboxdropbox.blob.core.windows.net/'+IMG_CONTAINER_NAME+'/'+file;
		}else{
			return 'http://127.0.0.1:10000/devstoreaccount1/'+IMG_CONTAINER_NAME+'/'+file;
		}
	}
};