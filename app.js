// Express
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Routing
var index = require('./routes/index');
var users = require('./routes/users');
var dopaste = require('./routes/dopaste');

// MySQL
// TODO: Not duplicating this shit everywhere
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'amypaste'
});
connection.connect();

// Create app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// body-parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/users', users);
app.post('/dopaste', dopaste);


app.get('/p', function(req, res) {
    res.send('pls use valid paste id <3');
});
app.get('/p/:id', function(req, res, next) {
    console.log('aaaaaaaaaaaaa');
    connection.query("SELECT content FROM pastes WHERE human_id = ?", req.params.id, function (error, results, fields) {
        if(error) {
            throw error;
        }
        if(results.length > 0) {
            console.log(results);
            res.render('paste', { title: 'pastebin', id: req.params.id, content: results[0].content });
        } else {
            console.log(results);
            var err = new Error('Invalid paste');
            next(err);
        }
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
