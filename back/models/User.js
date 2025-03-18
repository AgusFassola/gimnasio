//Modelo de usuario
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{ type: String, required:true },
    email:{ type: String, required:true, unique:true },
    password:{ type: String, required:true },
    role:{ type: String, enum:['admin','trainer','client'], default:'client' },
    membership:{ type: mongoose.Schema.Types.ObjectId, ref: 'Membership', default:null }
});

module.exports = mongoose.model('User', userSchema);