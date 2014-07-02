/**
 * @jsx React.DOM
 */

require(["react"], function(React) {

    var converter = new Showdown.converter();

    var BootstrapHeader =  React.createClass({displayName: 'BootstrapHeader',
        render: function() {
            return (
                React.DOM.div( {className:"page-header"}, 
                    React.DOM.h1(null, "Comment Example ", React.DOM.small(null, "Made by: Aleksander Waage"))
                )
            )
        }
    });


    var BootstrapNavBar =  React.createClass({displayName: 'BootstrapNavBar',
        render: function() {
            return (
                React.DOM.nav( {className:"navbar navbar-default", role:"navigation"}, 
                    React.DOM.div( {className:"container-fluid"}, 

                        React.DOM.div( {className:"navbar-header"}, 
                            React.DOM.button( {type:"button", className:"navbar-toggle", 'data-toggle':"collapse", 'data-target':"#bs-example-navbar-collapse-1"}, 
                                React.DOM.span( {className:"sr-only"}, "Toggle navigation"),
                                React.DOM.span( {className:"icon-bar"}),
                                React.DOM.span( {className:"icon-bar"}),
                                React.DOM.span( {className:"icon-bar"})
                            ),
                            React.DOM.a( {className:"navbar-brand", href:"#"}, "Comment")
                        ),

                        React.DOM.div( {className:"collapse navbar-collapse", id:"bs-example-navbar-collapse-1"}, 
                            React.DOM.ul( {className:"nav navbar-nav"}, 
                                React.DOM.li( {className:"active"}, React.DOM.a( {href:"#"}, "Link"))
                            )
                        )
                    )
                )
            )
        }
    });

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
                React.DOM.div(null, 
                    BootstrapHeader(null ),
                    BootstrapNavBar(null ),


                    React.DOM.div( {className:"jumbotron"}, 
                        CommentList( {data:this.state.data} ),
                        CommentForm( {onCommentSubmit:this.handleCommentSubmit} )
                    )
                )
                );
        }
    });

    var CommentList = React.createClass({displayName: 'CommentList',
        destroy: function (comment) {
            $.ajax({
                url: "http://localhost:8900/app/api/comment",
                dataType: 'json',
                contentType : 'application/x-www-form-urlencoded',
                type: 'DELETE',
                data: 'id=' + comment.id,
                success: function() {

                }.bind(this),
                error: function(xhr, status, err) {
                    console.error("http://localhost:8900/app/api/comment", status, err.toString());
                }.bind(this)
            });


        },
        render: function() {
            var self = this;
            var commentNodes = this.props.data.map(function (comment) {
                return Comment( {onDestroy:self.destroy.bind(this, comment), id:comment.id, time:comment.time, author:comment.author}, comment.text)
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
            var time = new Date().toLocaleTimeString();

            this.props.onCommentSubmit({author: author, text: text, time: time});
            this.refs.author.getDOMNode().value = '';
            this.refs.text.getDOMNode().value = '';
            return false;
        },

        render: function() {
            return (
                    React.DOM.form( {role:"form", className:"commentForm", onSubmit:this.handleSubmit}, 

                        React.DOM.div(  {className:"form-group"}, 
                            React.DOM.label( {for:"name"}, "Name:"),
                            React.DOM.input( {id:"name", className:"form-control", type:"text", placeholder:"Your name", ref:"author"} )
                        ),

                        React.DOM.div( {className:"form-group"}, 
                            React.DOM.label( {for:"comment"} , "Comment:"),
                            React.DOM.textarea( {id:"name", type:"text", className:"form-control", rows:"3", placeholder:"Say something...", ref:"text"} )
                        ),

                        React.DOM.button( {type:"submit", className:"btn btn-primary"}, "Post")

                    )
                );
        }
    });

    var Comment = React.createClass({displayName: 'Comment',
        buttonPressed: function(){
            this.props.onDestroy();
        },
        render: function() {
            var rawMarkup = converter.makeHtml(this.props.children.toString())
            return (
                React.DOM.div( {className:"comment"}, 
                    React.DOM.h2(null,  " ", this.props.author, " ", React.DOM.button( {type:"submit", className:"btn btn-default", onClick:this.buttonPressed}, 
                        React.DOM.span( {className:"glyphicon glyphicon-remove-circle"})
                    )),
                    React.DOM.h5(null, React.DOM.small(null,  " ", this.props.time, " " )),
                    React.DOM.p(null, React.DOM.span( {dangerouslySetInnerHTML:{__html: rawMarkup}} ))

                )
            );
        }
    });
    React.renderComponent(
        CommentBox(null ),
        document.getElementById('content')
    );


});

