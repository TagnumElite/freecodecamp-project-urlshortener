require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {isURL} = require('validator');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// I am not opening this up to abuse so it will be volatile.
// I will make 1(0) my website.
// Oh and yes, this is an array instead of dict. Pretend the index is the key.
var pretend_database = ["https://tagnumelite.com", "https://www.freecodecamp.org"];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl', function(req, res) {
    var results = pretend_database.reduce(function(map, obj, idx) {
        map[idx+1] = obj;
        return map;
    }, {});
    res.json(results);
});

app.post('/api/shorturl', function(req, res) {
    const url = req.body.url;
    if (isURL(url, {require_protocol: true})) {
        var id;
        if (pretend_database.includes(url)) {
            id = pretend_database.indexOf(url) + 1;
        } else {
            id = pretend_database.push(url);
        }
        res.json({original_url: url, short_url: id});
    } else {
        res.json({error: "invalid url"});
    }
});

app.get('/api/shorturl/:id', function(req, res) {
    const id = req.params.id;
    if (id < 1 || id > pretend_database.length) {
        return res.json({error: "short url doesn't exist"});
    }
    url = pretend_database[id-1]
    res.redirect(url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
