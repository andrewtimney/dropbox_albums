'use strict';

var Button = ReactBootstrap.Button;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Input = ReactBootstrap.Input;
var Alert = ReactBootstrap.Alert;

var Images = React.createClass({
	displayName: 'Images',
	setMode: function setMode(url) {
		return url.replace(/(mode=)[^\&]+/, 'mode=crop');
	},
	setBoundingBox: function setBoundingBox(url) {
		return url.replace(/(bounding_box=)[^\&]+/, 'bounding_box=256');
	},
	setThumbnailProps: function setThumbnailProps(url) {
		return this.setBoundingBox(this.setMode(url));
	},
	onRemove: function onRemove(index) {
		this.props.onRemove(index);
	},
	render: function render() {
		var images = [];
		var line = this.props.images.length > 0 ? React.createElement('hr', null) : '';
		for (var i = 0; i < this.props.images.length; i++) {
			images.push(React.createElement('img', { src: this.setThumbnailProps(this.props.images[i].thumbnailLink),
				className: 'image', onClick: this.onRemove.bind(this, i) }));
		}
		return React.createElement(
			'div',
			{ id: 'selected' },
			line,
			images
		);
	}
});

var DropboxButton = React.createClass({
	displayName: 'DropboxButton',

	handleClick: function handleClick() {
		Dropbox.choose({
			linkType: "direct",
			multiselect: true,
			extensions: ['images'],
			success: this.props.onSuccess
		});
	},
	render: function render() {
		return React.createElement(
			'span',
			null,
			React.createElement(
				Button,
				{
					onClick: this.handleClick,
					bsStyle: 'primary' },
				'Select Dropbox Pictures'
			)
		);
	}
});

var Form = React.createClass({
	displayName: 'Form',
	getInitialState: function getInitialState() {
		return { files: [] };
	},
	gotFiles: function gotFiles(files) {
		this.setState({ files: files });
	},

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(DropboxButton, { files: this.state.files, onSuccess: this.gotFiles }),
			React.createElement(
				'form',
				{ method: 'POST', className: '' },
				React.createElement('input', { type: 'email', name: 'email', placeholder: 'Email Address', required: true,
					className: 'form-control' }),
				React.createElement(Images, { images: this.state.files }),
				React.createElement('input', { type: 'hidden', id: 'results', name: 'results',
					value: JSON.stringify(this.state.files) }),
				React.createElement(
					'button',
					{ type: 'submit', id: 'create' },
					'Create'
				)
			)
		);
	}
});

var Create = React.createClass({
	displayName: 'Create',
	getInitialState: function getInitialState() {
		return { files: [], showHelp: false };
	},
	gotFiles: function gotFiles(files) {
		this.setState({ files: files });
	},
	toggleHelp: function toggleHelp() {
		this.setState({ showHelp: !this.state.showHelp });
	},
	removeImage: function removeImage(index) {
		this.state.files.splice(index, 1);
		this.setState({ files: this.state.files });
	},
	render: function render() {
		var createButton = React.createElement(
			Button,
			{ bsStyle: 'default', type: 'submit' },
			'Create Album'
		);
		var createClassName = this.state.files.length === 0 ? 'hide' : 'show';
		var helpText = this.state.showHelp ? 'Hide' : 'How does it work?';
		var helpClass = this.state.showHelp ? 'show' : 'hide';
		return React.createElement(
			Grid,
			null,
			React.createElement(
				Row,
				null,
				React.createElement(
					Col,
					{ md: 12 },
					React.createElement(
						'h1',
						null,
						'Share your dropbox pictures'
					),
					React.createElement(
						'a',
						{ onClick: this.toggleHelp },
						helpText
					),
					React.createElement(
						Alert,
						{ bsStyle: 'info', className: helpClass },
						'This should probably be useful but it\'s not.'
					),
					React.createElement('hr', null)
				)
			),
			React.createElement(
				Row,
				null,
				React.createElement(
					Col,
					{ md: 4 },
					React.createElement(DropboxButton, { files: this.state.files, onSuccess: this.gotFiles })
				),
				React.createElement(
					Col,
					{ md: 4 },
					React.createElement(
						'form',
						{ className: createClassName, method: 'POST' },
						React.createElement(Input, { type: 'text', name: 'albumTitle', id: 'albumTitle', placeholder: 'Album Title',
							buttonAfter: createButton }),
						React.createElement('input', { type: 'hidden', id: 'results', name: 'results',
							value: JSON.stringify(this.state.files) })
					)
				)
			),
			React.createElement(
				Row,
				null,
				React.createElement(
					Col,
					{ md: 12 },
					React.createElement(Images, { images: this.state.files, onRemove: this.removeImage })
				)
			)
		);
	}
});

React.render(React.createElement(Create, null), document.getElementById('react'));