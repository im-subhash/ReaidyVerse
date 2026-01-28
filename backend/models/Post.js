const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // We can store likes as a count primarily, logic for "who liked" requires array
    likesCount: {
        type: Number,
        default: 0
    },
    // For tracking who liked (to prevent double liking)
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
