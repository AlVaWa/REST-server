/**
 * @jsx React.DOM
 */

require(["react", "react-bootstrap-bower-master/Alert"], function(React, Alert ) {

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
                React.DOM.div( {className:"commentBox"}, 
                    CommentList( {data:this.state.data} ),
                    CommentForm( {onCommentSubmit:this.handleCommentSubmit} )
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
                React.DOM.form( {className:"commentForm", onSubmit:this.handleSubmit}, 

                    React.DOM.div(null , 
                        React.DOM.label( {for:"name"}, "Name:"),
                            React.DOM.input( {type:"text", placeholder:"Your name", ref:"author"} )
                    ),

                    React.DOM.div( {class:"form-group"}, 
                        React.DOM.label( {for:"time"}, "Time:"),
                        React.DOM.input(  {type:"text", placeholder:"Time", ref:"time"} )
                    ),

                    React.DOM.div( {class:"form-group"}, 
                        React.DOM.label(null , "Comment:"),
                        React.DOM.textarea( {type:"text", placeholder:"Say something...", ref:"text"} )
                    ),

                    React.DOM.button( {type:"submit"}, "Post")

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


});

