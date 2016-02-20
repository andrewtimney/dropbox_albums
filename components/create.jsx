var Button = ReactBootstrap.Button;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;
var Panel = ReactBootstrap.Panel;

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
				<div className="imgContainer animated slideInDown">
					<img src={this.setThumbnailProps(this.props.images[i].thumbnailLink)}
						className="image"  />
					<div className="closeImg" onClick={this.onRemove.bind(this, i)}>X</div>
				</div>
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
			<div className="dropboxBtn" onClick={this.handleClick}>
				<i className="fa fa-dropbox fa-2x"></i> Select Your Pictures From Dropbox
			</div>
		 </span>;
	}
});

var Form = React.createClass({
	getInitialState(){
		return { files: []};
	},
	gotFiles(files){
		this.setState({files:files});
	},
	render: function(){
		return <div>
				<DropboxButton files={this.state.files} onSuccess={this.gotFiles} />
				<form method="POST" className="">
					<input type="email" name="email" placeholder="Email Address" required
						className="form-control" />
					<Images images={this.state.files} />
					<input type="hidden" id="results" name="results"
						value={JSON.stringify(this.state.files)} />
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
	removeImage(index){
		this.state.files.splice(index, 1);
		this.setState({files: this.state.files});
	},
	render(){
		let createButton = <Button bsStyle="default" type="submit">
													Create Album
												</Button>;
		let createClassName = this.state.files.length === 0 ? 'hide' : 'show';
		let helpText = this.state.showHelp ? 'Hide' : 'How does it work?';
		let helpClass = this.state.showHelp ? 'show' : 'hide';
		return	<Grid>
						<Row>
							<Col md={12}>
								<Row>
									<Col md={6}>
										<h1>Share your dropbox pictures</h1>
											<div className="form">
												<DropboxButton files={this.state.files} onSuccess={this.gotFiles} />
												<form className={createClassName} method="POST">
													<Input type="text" name="albumTitle" id="albumTitle"
														placeholder="Album Title (optional)"
														buttonAfter={createButton} />
													<input type="hidden" id="results" name="results"
														value={JSON.stringify(this.state.files)} />
												</form>
											</div>
									</Col>
									<Col md={6}>
										<div className="pull-right">
											<a href="https://twitter.com/timney">
												<i className="fa fa-twitter"></i>
											</a>
										</div>
										<Panel>
											<h3>How does this work?</h3>
											Select the pictures from Dropbox that you want to share,
											we create your album, you get an unique link to your album.
										</Panel>
									</Col>
								</Row>
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
