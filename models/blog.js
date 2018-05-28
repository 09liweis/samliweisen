const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: String,
    url: String,
    content: String,
    image: String,
    category: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

BlogSchema.pre('save', function(next) {
    const currentDate = new Date();
    this.update_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

module.exports = mongoose.model('Blog', BlogSchema);