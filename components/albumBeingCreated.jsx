var Panel = ReactBootstrap.Panel;

var Page = React.createClass({
  getInitialState: function(){
    return { url: location.href };
  },
  componentDidMount: function(){
    var socket = io();
    socket.on('album done', function(success){
      console.log('success', success);
      if(success){
        document.location.reload();
      }
    });
  },
  render: function(){
    return <div>
        <h1>
          <i className="fa fa-cog fa-spin"></i>
          &nbsp;Creating Your Album
        </h1>
        <p>
          This page will refresh when your album is ready
        </p>
        <Panel header="Your album can be found at this url:">
          {this.state.url}
        </Panel>
      </div>;
  }
});

React.render(
	<Page />,
	document.getElementById('react')
);
