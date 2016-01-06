var blob = require('./azure-blob');
var utils = require('../utils')
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var urlP = require('url');

function moveImageToAzure(url, id, isThumb){
	return new Promise(function(resolve, reject){
		try{
				return blob.download(url)
				.then(function(response){

					var filename = path.join(
													id,
													isThumb ? 'thumb' : '',
													path.basename(decodeURI(url)).replace(' ','_'))
													.replace('\\', '/');

					if(isThumb && filename.indexOf('?') !== -1){
						filename = filename.substring(0, filename.indexOf('?'));
					}

					return uploadImageStream(response, filename)
						.then(function(result){
							resolve({ url: filename });
						},
					reject);
				},
				reject);
			}
			catch(error){
				 console.error('DownloadImage', error, folderName, url, tempFolder);
			}
	});
}

function uploadImageStream(stream, filename){
	return blob.uploadStream(stream, filename);
}

function uploadImages(album){
	var files = album.files; // Dropbox files https://www.dropbox.com/developers/chooser
	var promises = [];
	for(var i = 0; i < files.length; i++){
		promises.push(
			moveImageToAzure(files[i].link, album.id).then(function(result){
						album.azureFiles.push(decodeURI(result.url));
				})
		);
		promises.push(
			moveImageToAzure(files[i].thumbnailLink, album.id, true).then(function(result){
						album.azureFiles.push(decodeURI(result.url));
				})
		);
	}
	return Promise.all(promises).then(function(){
		return album;
	});
}

module.exports = {
	uploadImages: uploadImages
};

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
						console.log('unlinking '+curPath);
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};
