const mongoose = require('mongoose');
const {Schema} = mongoose;

const calificacion1Schema = new Schema({
    alumno: {type: String, required: true},
    p1: {type: String, required: false},
    p2: {type: String, required: false},
    recp1: {type: String, required: false},
    recp2: {type: String, required: false},
    ext: {type: String, required: false},
    lab1: {type: String, required: false},
    lab2: {type: String, required: false},
    reclab12: {type: String, required: false},
    lab3: {type: String, required: false},
    lab4: {type: String, required: false},
    reclab34: {type: String, required: false},
    año: {type: Date, required: true, default: new Date().getFullYear()},
    date: {type: Date, default: Date.now},
}); //esto le dice a la DB como van a ser los datos

module.exports = mongoose.model('Calificacion1', calificacion1Schema);