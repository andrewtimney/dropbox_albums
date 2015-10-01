var azureStorage = require('azure-storage');
var shortid = require('shortid');

var TABLE_NAME = "albums";
var tableService;

if(process.env.NODE_ENV === 'production'){
	tableService = azureStorage.createTableService('UseDevelopmentStorage=true;');
}else{
	tableService = azureStorage.createTableService(); 
}

tableService.createTableIfNotExists(TABLE_NAME, function(error, result, response){
	if(error) console.log(`Could not create Table ${TABLE_NAME}`,error);
});

var entGen = azureStorage.TableUtilities.entityGenerator;

function createAlbum(al){
	var album = {
		PartitionKey: entGen.String("1"),
  		RowKey: entGen.String(al.id),
		expires: entGen.DateTime(al.expires),
		files: entGen.String(JSON.stringify(al.files))
	};
	tableService.insertEntity(TABLE_NAME, album, function(error, result, response){
		if(error) console.log(`Could not Creat Album ${al.id}`);
	});
}

module.exports = {
	createAlbum: createAlbum
};