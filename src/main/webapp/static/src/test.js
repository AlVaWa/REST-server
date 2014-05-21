/**
 * @jsx React.DOM
 */

require(["react"], function(React) {

    var converter = new Showdown.converter();
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
                <div className="commentBox">
                    <CommentList data={this.state.data} />
                    <CommentForm onCommentSubmit={this.handleCommentSubmit} />
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

    // Simple pure-React component so we don't have to remember
    // Bootstrap's classes
    var BootstrapButton = React.createClass({
        render: function() {
            // transferPropsTo() is smart enough to merge classes provided
            // to this component.
            return this.transferPropsTo(
                <a href="javascript:;" role="button" className="btn">
        {this.props.children}
                </a>
            );
        }
    });

    var CommentForm = React.createClass({
        handleSubmit: function() {
            var author = this.refs.author.getDOMNode().value.trim();
            var text = this.refs.text.getDOMNode().value.trim();
            var time = this.refs.time.getDOMNode().value.trim();
            this.props.onCommentSubmit({author: author, text: text, time: time});
            this.refs.author.getDOMNode().value = '';
            this.refs.text.getDOMNode().value = '';
            this.refs.time.getDOMNode().value = '';
            return false;
        },

        render: function() {
            return (
                <form className="commentForm" onSubmit={this.handleSubmit}>

                    <div >
                        <label for="name">Name:</label>
                            <input type="text" placeholder="Your name" ref="author" />
                    </div>

                    <div class="form-group">
                        <label for="time">Time:</label>
                        <input  type="text" placeholder="Time" ref="time" />
                    </div>

                    <div class="form-group">
                        <label >Comment:</label>
                        <textarea type="text" placeholder="Say something..." ref="text" />
                    </div>

                    <button type="submit">Post</button>

                </form>
                );
        }
    });

    var Comment = React.createClass({
        render: function() {
            var rawMarkup = converter.makeHtml(this.props.children.toString())
            return (
                <div className="comment">
                    <h2 className="commentAuthor">
                            {this.props.author}
                    </h2>
                    <h5>
                            {this.props.time}
                    </h5>
                    <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
                </div>
                );
        }
    });
    React.renderComponent(
        <CommentBox />,
        document.getElementById('content')
    );


});

