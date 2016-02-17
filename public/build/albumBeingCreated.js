'use strict';

var Panel = ReactBootstrap.Panel;

var Page = React.createClass({
  displayName: 'Page',

  getInitialState: function getInitialState() {
    return { url: location.href };
  },
  componentDidMount: function componentDidMount() {
    var socket = io();
    socket.on('album done', function (success) {
      console.log('success', success);
      if (success) {
        document.location.reload();
      }
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        React.createElement('i', { className: 'fa fa-cog fa-spin' }),
        ' Creating Your Album'
      ),
      React.createElement(
        'p',
        null,
        'This page will refresh when your album is ready'
      ),
      React.createElement(
        Panel,
        { header: 'Your album can be found at this url:' },
        this.state.url
      )
    );
  }
});

React.render(React.createElement(Page, null), document.getElementById('react'));