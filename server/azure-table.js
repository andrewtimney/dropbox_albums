var azureStorage = require('azure-storage');
var shortid = require('shortid');

var TABLE_NAME = "albums";

var tableService;
if(process.env.NODE_ENV === 'production'){
	tableService = azureStorage.createTableService();
}else{
	tableService = azureStorage.createTableService('UseDevelopmentStorage=true;'); 
}

tableService.createTableIfNotExists(TABLE_NAME, function(error, result, response){
	if(error) console.error(`Could not create Table ${TABLE_NAME}`,error);
});

var entGen = azureStorage.TableUtilities.entityGenerator;

function createAlbum(al){
	var album = {
		PartitionKey: entGen.String("1"),
  		RowKey: entGen.String(al.id),
		expires: entGen.DateTime(al.expires),
		files: entGen.String(JSON.stringify(al.files)),
		email: entGen.String(al.email)
	};
	tableService.insertEntity(TABLE_NAME, album, function(error, result, response){
		if(error) console.error(`Could not Create Album ${al.id}`, error);
	});
}

function getAlbum(id, callback){
	tableService.retrieveEntity(TABLE_NAME, "1", id, function(error, result, response){
		callback(result, error);
		if(error){
			console.error(`Could not retrieve album ${id}`, error);
		}
	});
}

module.exports = {
	createAlbum: createAlbum,
	getAlbum: getAlbum
};