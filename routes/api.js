/*
 * Serve JSON to our AngularJS client
 */
var mongoose = require('mongoose'),
    Thread = require('../model/thread').Thread;

exports.user = function (req, res) {
    var user = req.user;
    if (user) {
        user.authenticated = true;
        res.json(user);
    } else {
        res.json();
    }

};

exports.thread = function(req, res) {
    var id = req.query.id;
    Thread.findOne({_id: id}, function(err, thread) {
        if (err) { return res.err; }
        else {

            return res.json(thread);
        }
    });
};

exports.board = function(req, res) {
    Thread.find({}, function(err, threads) {
        if (err) { return res.err; }
        else {
            console.log(threads);
            return res.json(threads);
        }
    });
};
