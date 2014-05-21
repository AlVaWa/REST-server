/**
 * @jsx React.DOM
 */

require(["react"], function(React) {

    var converter = new Showdown.converter();

    var BootstrapHeader =  React.createClass({
        render: function() {
            return (
                <div className="page-header">
                    <h1>Comment Example <small>Made by: Aleksander Waage</small></h1>
                </div>
            )
        }
    });


    var BootstrapNavBar =  React.createClass({
        render: function() {
            return (
                <nav className="navbar navbar-default" role="navigation">
                    <div className="container-fluid">

                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="#">Comment</a>
                        </div>

                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#">Link</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )
        }
    });

    var CommentBox = React.createClass({
        loadCommentsFromServer: function() {
            $.ajax({
                url: "http://localhost:8900/app/api/comment",
                dataType: 'json',
                success: function(data) {
                    this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("http://localhost:8900/app/api/comment", status, err.toString());
                }.bind(this)
            });
        },

        handleCommentSubmit: function(comment) {
            var comments = this.state.data;
            var newComments = comments.concat([comment]);
            this.setState({data: newComments});
            var dataList = new Array(comment);

            $.ajax({
                url: "http://localhost:8900/app/api/comment",
                dataType: 'json',
                contentType : 'application/json',
                type: 'POST',
                data: JSON.stringify(dataList),
                success: function(data) {
                    this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("http://localhost:8900/app/api/comment", status, err.toString());
                }.bind(this)
            });
        },
        getInitialState: function() {
            return {data: []};
        },
        componentWillMount: function() {
            this.loadCommentsFromServer();
            setInterval(this.loadCommentsFromServer, 2000);
        },
        render: function() {
            return (
                <div>
                    <BootstrapHeader />
                    <BootstrapNavBar />


                    <div className="jumbotron">
                        <CommentList data={this.state.data} />
                        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                    </div>
                </div>
                );
        }
    });

    var CommentList = React.createClass({
        render: function() {
            var commentNodes = this.props.data.map(function (comment) {
                return <Comment time={comment.time} author={comment.author}>{comment.text}</Comment>
            });
            return (
                <div className="commentList">
                        {commentNodes}
                </div>
                );
        }
    });

    var CommentForm = React.createClass({
        handleSubmit: function() {
            var author = this.refs.author.getDOMNode().value.trim();
            var text = this.refs.text.getDOMNode().value.trim();
            var time = new Date().toLocaleTimeString();

            this.props.onCommentSubmit({author: author, text: text, time: time});
            this.refs.author.getDOMNode().value = '';
            this.refs.text.getDOMNode().value = '';
            return false;
        },

        render: function() {
            return (
                    <form role="form" className="commentForm" onSubmit={this.handleSubmit}>

                        <div  className="form-group">
                            <label for="name">Name:</label>
                                <input id="name" className="form-control" type="text" placeholder="Your name" ref="author" />
                        </div>

                        <div className="form-group">
                            <label for="comment" >Comment:</label>
                            <textarea id="name" type="text" className="form-control" rows="3" placeholder="Say something..." ref="text" />
                        </div>

                        <button type="submit" className="btn btn-primary">Post</button>

                    </form>
                );
        }
    });

    var Comment = React.createClass({
        render: function() {
            var rawMarkup = converter.makeHtml(this.props.children.toString())
            return (
                <div className="comment">
                    <h2> {this.props.author} </h2>
                    <h5><small> {this.props.time} </small></h5>
                    <p><span dangerouslySetInnerHTML={{__html: rawMarkup}} /></p>
                </div>
            );
        }
    });
    React.renderComponent(
        <CommentBox />,
        document.getElementById('content')
    );


});

