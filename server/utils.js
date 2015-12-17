var path = require('path');
var fs = require('fs');

module.exports = {

	getTempFolder: function(folderName){
		var tempFolder = path.join(__dirname, '../temp', folderName);
		try{
			fs.mkdirSync(tempFolder);
			return tempFolder;
		}catch(err){
			console.error('Folder exists, deal with it');
		}
		return tempFolder;
	},

	getTempPath: function(folder, url){
		return path.join(folder, path.basename(url).replace('%', '-'));
	}

};
