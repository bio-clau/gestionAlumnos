const mongoose = require('mongoose');
const {Schema} = mongoose;

const studentSchema = new Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    carrera: {type: String, required: true},
    registro: {type: String, required: false},
    dni: {type: String, required: false},
    email:{type: String, required: true},
    año: {type: Date, required: true, default: new Date().getFullYear()},
    info1: {type: Boolean, required: true, default: false},
    info2: {type: Boolean, required: true, default: false},
    tpgi1: {type: Boolean, required: true, default: false},
    tpgi2: {type: Boolean, required: true, default: false},
    date: {type: Date, default: Date.now},
}); //esto le dice a la DB como van a ser los datos

module.exports = mongoose.model('Student', studentSchema);