var blob = require('./azure-blob');
var utils = require('../utils')
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

function downloadImage(url, folderName){
	return new Promise(function(resolve, reject){
		try{
				var tempFolder = utils.getTempFolder(folderName);
				var tempPath = utils.getTempPath(tempFolder, url);

				var fileStream = fs.createWriteStream(tempPath);
				blob.download(url, tempPath)
				.then(function(response){
					 var stream = response.pipe(fileStream);
					 stream.on('finish', function () {
					 	resolve({ tempPath: tempPath, url: url });
					 });
				},
				reject);
			}
			catch(error){
				 console.error('DownloadImage', error, folderName, url, tempFolder);
			}
	});
}

function uploadImage(file, album){
	return blob.upload(file, album.id)
		.then(function(result){
			//fs.unlinkSync(file);
			album.azureFiles.push(decodeURI(result.replace('\\', '/')));
		});
}

function uploadImages(album){
	var files = album.files;
	var promises = [];
	for(var i = 0; i < files.length; i++){
		promises.push(
			downloadImage(files[i].link, album.id)
				.then(function(download){
					return uploadImage(download.tempPath, album);
				})
		);
	}
	return Promise.all(promises);
}

module.exports = {
	uploadImages: uploadImages
};
