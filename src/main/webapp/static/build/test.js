/**
 * @jsx React.DOM
 */

var converter = new Showdown.converter();

var CommentBox = React.createClass({displayName: 'CommentBox',
    loadCommentsFromServer: function() {
        $.ajax({
            url: "http://localhost:8900/app/api/comment",
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {data: []};
    },
    componentWillMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            React.DOM.div( {className:"commentBox"}, 
                React.DOM.h1(null, "Comments"),
                CommentList( {data:this.state.data} ),
                CommentForm(null )
            )
            );
    }
});

var CommentList = React.createClass({displayName: 'CommentList',
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
            return Comment( {time:comment.time, author:comment.author}, comment.text)
        });
        return (
            React.DOM.div( {className:"commentList"}, 
                    commentNodes
            )
            );
    }
});

var CommentForm = React.createClass({displayName: 'CommentForm',
    render: function() {
        return (
            React.DOM.div( {className:"commentForm"}, 
            "Hello, world! I am a CommentForm."
            )
            );
    }
});

var Comment = React.createClass({displayName: 'Comment',
    render: function() {
        var rawMarkup = converter.makeHtml(this.props.children.toString())
        return (
            React.DOM.div( {className:"comment"}, 
                React.DOM.h2( {className:"commentAuthor"}, 
                        this.props.author
                ),
                React.DOM.h5(null, 
                        this.props.time
                ),
                React.DOM.span( {dangerouslySetInnerHTML:{__html: rawMarkup}} )
            )
            );
    }
});

React.renderComponent(
    CommentBox(null ),
    document.getElementById('content')
);
