const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required:true
    },
    category: {
        type: String,
        required:true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: currency,
        required:true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;

// 5a16aa4c743a1e2d10802617
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTE2YTllYzc0M2ExZTJkMTA4MDI2MTYiLCJpYXQiOjE1MTE0MzQ3NTYsImV4cCI6MTUxMTQzODM1Nn0.Z2jYwuD_jpjNN4RBbfRmAZuR0Cqbil9LFJ13ulTu7jA