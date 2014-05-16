requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
        "app": "../app",
        "jquery": ["jquery"],
        "react_0.10.min": ["react_0.10.min"],
        "showdown.min": ["showdown.min"],
        "react-bootstrap": ["react-bootstrap"]
    }
});

requirejs(["app/main"]);