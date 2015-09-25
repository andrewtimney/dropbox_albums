var button = Dropbox.createChooseButton({
	linkType: "direct",
	multiselect: true,
	extensions: ['images'],
	success: function(files){
		
		console.log(files);
		var selected = document.getElementById("selected");
		selected.innerHTML = '';
		files.forEach(function(file){
			var img = document.createElement('img');
			img.src = setMode(file.thumbnailLink);
			selected.appendChild(img);					
		});
		
		var resultsEl = document.getElementById("results");
		resultsEl.value = JSON.stringify(files);
	}
});

document.getElementById("container").appendChild(button);	
		
function setMode(url){
	return url.replace(/(mode=)[^\&]+/, 'mode=crop');
}