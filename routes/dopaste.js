/**
 * Created by amy on 3/26/17.
 */
var express = require('express');
var router = express.Router();

var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");

// MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'amypaste'
});

connection.connect();
connection.query("CREATE TABLE IF NOT EXISTS pastes (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, human_id VARCHAR(64) NOT NULL, content TEXT NOT NULL);", function (error, results, fields) {
    if (error) {
        throw error;
    }
    console.log("Got back: " + results);
    console.log("Got back: " + fields);
});

router.post('/dopaste', function (req, res, next) {
    var text = req.body.text;
    if (text.length == 0) {
        res.send(JSON.stringify({error: "No empty pastes"}));
    } else {
        // Open MySQL connection, insert into DB
        var id = SHA256(text).toString(CryptoJS.enc.Hex);
        console.log(id);
        connection.query("INSERT INTO pastes SET ?", {"human_id": id, "content": text}, function (error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log("Got back: " + results);
            console.log("Got back: " + fields);
        });
        res.send(id);
    }
});

module.exports = router;
