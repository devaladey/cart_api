const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A review must be written by a user'],
        ref: 'User'
    },
    comment: {
        type: String,
        required: [true, 'A review  must have a comment']
    }
});

reviewSchema.pre('find', function(next){
    this.populate('user');
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;