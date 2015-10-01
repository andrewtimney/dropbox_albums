var azureStorage = require('azure-storage');
var config = require('../azureconfig');
var path = require('path');

// if(!process.env.IsAzure){
// 	
// 	var IMG_CONTAINER_NAME = "images";
// 	var ALBUM_CONTAINER_NAME = "albums";
// 	var blobService = azureStorage.createBlobService('UseDevelopmentStorage=true;');//config.accountName, config.accountKey);
// 	
// 	blobService.createContainerIfNotExists(IMG_CONTAINER_NAME, {
// 	publicAccessLevel: 'blob'
// 	}, 
// 	function(error, result, response){
// 		if(error) console.log(error);	
// 	});
// 	
// 	blobService.createContainerIfNotExists(ALBUM_CONTAINER_NAME, {
// 	publicAccessLevel: 'blob'
// 	}, 
// 	function(error, result, response){
// 		if(error) console.log(error);	
// 	});
// 	
// 	function uploadImage(file){
// 		blobService.createBlockBlobFromLocalFile(
// 			IMG_CONTAINER_NAME, path.basename(file), file, 
// 			function(error, result, response) {
// 				if (!error) {
// 					// file uploaded
// 					console.log(`File uploaded: ${file}`);
// 				}
// 			});
// 	}
// }
module.exports = {};