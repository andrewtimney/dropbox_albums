var azureStorage = require('azure-storage');
var config = require('../azureconfig');

var CONTAINER_NAME = "images";
var blobService = azureStorage.createBlobService(config.accountName, config.accountKey);

blobService.createContainerIfNotExists(CONTAINER_NAME, {
  publicAccessLevel: 'blob'
}, 
function(error, result, response){
	if(error) console.log(error);	
});

function upload(){
	blobService.createBlockBlobFromLocalFile(
		CONTAINER_NAME, 'taskblob', 'task1-upload.txt', 
		function(error, result, response) {
			if (!error) {
				// file uploaded
			}
		});
}

module.exports = {};