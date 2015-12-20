var blob = require('./azure-blob');
var utils = require('../utils')
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');

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
			album.azureFiles.push(decodeURI(result.replace('\\', '/')));
			//fse.removeSync(file);
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
	return Promise.all(promises).then(function(){
		var tempFolder = path.join(__dirname, '../../temp', album.id);
		//console.log(tempFolder);
		//deleteFolderRecursive(tempFolder);
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
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};
