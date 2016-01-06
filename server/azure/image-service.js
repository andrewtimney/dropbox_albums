var blob = require('./azure-blob');
var utils = require('../utils')
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var urlP = require('url');

function moveImageToAzure(url, id){
	return new Promise(function(resolve, reject){
		try{
				return blob.download(url)
				.then(function(response){
					var filename = path.join(id, path.basename(url));
					console.log('download', filename);
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
	var files = album.files;
	var promises = [];
	for(var i = 0; i < files.length; i++){
		promises.push(
			moveImageToAzure(files[i].link, album.id).then(function(result){
						album.azureFiles.push(
							decodeURI(result.url.replace('\\', '/'))
						);
						console.log('File put', result);
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
