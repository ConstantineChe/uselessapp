var mongoose = require('mongoose'),
    userSchema = require('./user').userSchema;

var author = new mongoose.Schema({
    name: String,
    email: String
});

var postSchema =  new mongoose.Schema({
    author: author,
    date: {
        type: Date,
        default: Date.now },
    title: String,
    text: {
        type: String,
        required: true
    }
});

var threadSchema = new mongoose.Schema({
    author: author,
    openPost: postSchema,
    posts: [postSchema]
});

exports.Thread = mongoose.model('Thread', threadSchema);
exports.Post = mongoose.model('Post', postSchema);
