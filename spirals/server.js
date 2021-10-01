//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/spirals'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/spirals/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8888);