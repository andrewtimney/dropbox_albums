var Button = ReactBootstrap.Button;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;

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
	onRemove(index){
		this.props.onRemove(index);
	},
	render(){
		var images = [];
		var line = this.props.images.length > 0 ? <hr /> : '';
		for(var i = 0; i < this.props.images.length; i++){
			images.push(
				<img src={this.setThumbnailProps(this.props.images[i].thumbnailLink)}
					className="image" onClick={this.onRemove.bind(this, i)} />
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
				<form method="POST" className="">
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
		return { files: [], showHelp: false};
	},
	gotFiles(files){
		this.setState({files:files});
	},
	toggleHelp(){
		this.setState({showHelp: !this.state.showHelp});
	},
	removeImage(index){
		this.state.files.splice(index, 1);
		this.setState({files: this.state.files});
	},
	render(){
		let createButton = <Button bsStyle="default">
													Create Album
												</Button>;
		let createClassName = this.state.files.length === 0 ? 'hide' : 'show';
		let helpText = this.state.showHelp ? 'Hide' : 'How does it work?';
		let helpClass = this.state.showHelp ? 'show' : 'hide';
		return	<Grid>
						<Row>
							<Col md={12}>
								<h1>Share your dropbox pictures</h1>
								<a onClick={this.toggleHelp}>{helpText}</a>
								<Alert bsStyle="info" className={helpClass}>
									This should probably be useful but it's not.
								</Alert>
								<hr/>
							</Col>
						</Row>
						<Row>
							<Col md={4}>
								<DropboxButton files={this.state.files} onSuccess={this.gotFiles} />
							</Col>
							<Col md={4}>
								<form className={createClassName}>
									<Input type="email" name="email" placeholder="Email Address"
										buttonAfter={createButton} />
								</form>
							</Col>
						</Row>
						<Row>
							<Col md={12}>
								<Images images={this.state.files} onRemove={this.removeImage} />
							</Col>
						</Row>
					</Grid>;
	}
});

React.render(
	<Create />,
	document.getElementById('react')
);
