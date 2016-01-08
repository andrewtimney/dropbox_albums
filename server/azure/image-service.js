var blob = require('./azure-blob');
var Promise = require('bluebird');
var path = require('path');
var urlP = require('url');

function moveImageToAzure(url, id, isThumb){
	return new Promise(function(resolve, reject){

		if(isThumb){
			url = setBoundingBox(setMode(url));
		}

		try{
				return blob.download(url)
				.then(function(response){
					var pathname = urlP.parse(url).pathname;
					var filename = path.join(
													id,
													isThumb ? 'thumb' : '',
													path.basename(decodeURI(pathname)).replace(' ','_'))
													.replace(/\\/g, '/');

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

		var tp = moveImageToAzure(files[i].link, album.id).then(function(result){
					return decodeURI(result.url);
			});

	  var ip = moveImageToAzure(files[i].thumbnailLink, album.id, true).then(function(result){
					return decodeURI(result.url);
			});

		promises.push(Promise.all([tp, ip]).then(function(bothresult){
			console.log('both', bothresult);
			var uploadedImgs = { thumb:bothresult[1], image:bothresult[0] };
			album.azureFiles.push(uploadedImgs);
		}));
	}
	return Promise.all(promises).then(function(){
		return album;
	});
}

module.exports = {
	uploadImages: uploadImages
};

function setMode(url){
	return url.replace(/(mode=)[^\&]+/, 'mode=crop');
}
function setBoundingBox(url){
	return url.replace(/(bounding_box=)[^\&]+/, 'bounding_box=256');
}
