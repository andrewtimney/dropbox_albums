document.querySelector('#select').addEventListener('click',function(){
	
	Dropbox.choose({
		linkType: "direct",
		multiselect: true,
		extensions: ['images'],
		success: function(files){
			
			console.log(files);
			var selected = document.getElementById("selected");
			selected.innerHTML = '';
			files.forEach(function(file){
				var img = document.createElement('img');
				img.src = setBoundingBox(setMode(file.thumbnailLink));
				selected.appendChild(img);					
			});
			
			var resultsEl = document.getElementById("results");
			resultsEl.value = JSON.stringify(files);
		}
	});

});

function setMode(url){
	return url.replace(/(mode=)[^\&]+/, 'mode=crop');
}

function setBoundingBox(url){
	return url.replace(/(bounding_box=)[^\&]+/, 'bounding_box=256');
}