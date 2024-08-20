const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    image: String,
    description: String,
    price: Number
});

module.exports = mongoose.model('Product', ProductSchema);
