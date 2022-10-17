const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    withness: {
        type: String,
        default: 'victim',
        enum: ['victim', 'bystander']
    },
    tbody: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Report', reportSchema)

module.exports = Blog;