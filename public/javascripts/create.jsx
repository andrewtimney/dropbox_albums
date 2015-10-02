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

var Images = React.createClass({
	render: function(){
		var images = [];
		for(var i = 0; i < this.props.images.length; i++){
			images.push(<img src={this.props.images[i].thumbnailLink} />);
		}
		return <div>{images}</div> 
	}
});

var DropboxButton = React.createClass({
	success: function(){
	},
	handleClick: function(){
		
		Dropbox.choose({
			linkType: "direct",
			multiselect: true,
			extensions: ['images'],
			success: this.success
		});
	},
	render: function(){
		return <button onClick={this.handleClick}>
				 Select Dropbox Pictures
			   </button>;
	}
});

var Form = React.createClass({
	render: function(){
		return <div>
				<h2>Album</h2>
				<DropboxButton />
			</div>;
	}
});

React.render(
	<Form />,
	document.getElementById('react')
);