const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

const promoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    }
});

var Promotions = mongoose.model('Promo', promoSchema);
module.exports = Promotions;