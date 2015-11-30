var Button = ReactBootstrap.Button;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;

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
		var line = this.props.images.length > 0 ? <hr /> : '';
		for(var i = 0; i < this.props.images.length; i++){
			images.push(
				<img src={this.setThumbnailProps(this.props.images[i].thumbnailLink)} className="image" />
			);
		}

		return <div id="selected">
			{line}
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
		return <span>
		   <Button
				 onClick={this.handleClick}
				 bsStyle="primary">
				 Select Dropbox Pictures
			 </Button>
		 </span>;
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
					<input type="email" name="email" placeholder="Email Address" required
						className="form-control" />
					<Images images={this.state.files} />
					<input type="hidden" id="results" name="results" value={JSON.stringify(this.state.files)} />
					<button type="submit" id="create">Create</button>
				</form>
			   </div>;
	}
});

var Create = React.createClass({
	getInitialState(){
		return { files: []};
	},
	gotFiles(files){
		this.setState({files:files});
	},
	render(){
	 return	<Grid>
						<Row>
							<Col md={12}>
								<h1>Share your dropbox pictures</h1>
								<hr/>
							</Col>
						</Row>
						<Row>
							<Col md={4}>
								<DropboxButton files={this.state.files} onSuccess={this.gotFiles} />
							</Col>
							<Col md={4}>
								<input type="email" name="email" placeholder="Email Address" />
								<Button bsStyle="default">
									Create Album
								</Button>
							</Col>
						</Row>
						<Row>
							<Col md={12}>
								<Images images={this.state.files} />
							</Col>
						</Row>
					</Grid>;
	}
});

React.render(
	<Create />,
	document.getElementById('react')
);
