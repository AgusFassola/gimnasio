//Modelo de membresia
const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    duration:{ type: Number, required: true },//en dias
    price: { type: Number, required: true },
    benefits: { type: [String], default: [] }
});

module.exports = mongoose.model('Membership', membershipSchema);