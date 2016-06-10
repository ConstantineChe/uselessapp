var Post = require('../model/thread').Post,
    User = require('../model/user').User,
    Thread = require('../model/thread').Thread;

var anonymous = new User({
    name: 'Anonymous',
    email: 'anonymous@anon.name',
    password: 'pw'
});

module.exports = function (io) {
    'use strict';
    io.on('connection', function (socket) {
        socket.on('thread', function (from, msg) {
            console.log('recieved new thread from',
                        from, 'msg', JSON.stringify(msg));
            var user = (from) ? new User(from) : anonymous;
            console.log('broadcasting message');
            console.log('payload is', msg);
            var post = new Post({
                text: msg.text,
                author: user,
                title: msg.title
            });
            var thread = new Thread({
                author: {
                    name: user.name,
                    email: user.email
                },
                openPost: post,
                posts: []
            });
            thread.save(function (err) {
                    console.log(err);
                });
            console.log('open post', post);
            console.log('thread', thread);
            io.sockets.emit('broadcastBoard', {
                payload: thread,
                source: from
            });
            console.log('broadcast complete');
        });
        socket.on('post', function(from, msg) {
            var id = msg.threadId;
            Thread.findOne({_id: id}, function(err, thread) {
                if (err) {
                    console.log(err);
                    return err;
                }
                console.log('recieved new post from',
                            from, 'msg', JSON.stringify(msg));
                var user = (from) ? new User(from) : anonymous;
                console.log('broadcasting post');
                console.log('updating thread', thread);
                console.log('payload is', msg);
                var post = new Post({
                    text: msg.post.text,
                    author: {
                        name: user.name,
                        email: user.email
                    },
                    title: msg.post.title
                });
                console.log('Post: ', post);
                Thread.update({_id: id}, {$push: {posts: post}}, {}, function(err, upd) {
                    if (err) {
                        console.log(err);
                        return err;
                    } else {
                        console.log('Updated id', id);
                        io.sockets.emit('broadcastThread', {
                            payload: post,
                            threadId: id,
                            source: from
                        });
                    }
                });
            });
        });
    });
};
