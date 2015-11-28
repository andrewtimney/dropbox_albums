var Button = ReactBootstrap.Button;

var Images = React.createClass({
	setMode(url){
		return url.replace(/(mode=)[^\&]+/, 'mode=crop');
	},
	setBoundingBox(url){
		return url.replace(/(bounding_box=)[^\&]+/, 'bounding_box=256');
	},
	setThumbnailProps(url){
		return this.setBoundingBox(this.setMode(url));
	},
	render(){
		var images = [];
		for(var i = 0; i < this.props.images.length; i++){
			images.push(
				<img src={this.setThumbnailProps(this.props.images[i].thumbnailLink)} />
			);
		}
		return <div id="selected">
			{images}
		</div>;
	}
});

var DropboxButton = React.createClass({
	handleClick: function(){
		Dropbox.choose({
			linkType: "direct",
			multiselect: true,
			extensions: ['images'],
			success: this.props.onSuccess
		});
	},
	render: function(){
		return <div>
				<Button
				 onClick={this.handleClick}
				 bsStyle="primary">
				 Select Dropbox Pictures
			    </Button>
			  </div>;
	}
});

var Form = React.createClass({
	getInitialState(){
		return { files: []};
	},
	gotFiles(files){
		console.log('got files');
		this.setState({files:files});
	},
	render: function(){
		return <div>
				<DropboxButton files={this.state.files} onSuccess={this.gotFiles} />
				<form method="POST">
					<input type="email" name="email" placeholder="Email Address" required />
					<Images images={this.state.files} />
					<input type="hidden" id="results" name="results" value={JSON.stringify(this.state.files)} />
					<button type="submit" id="create">Create</button>
				</form>
			   </div>;
	}
});

React.render(
	<Form />,
	document.getElementById('react')
);
