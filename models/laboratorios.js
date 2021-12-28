const mongoose = require('mongoose');
const {Schema} = mongoose;

const labSchema = new Schema({
    numlab: {type: String, required: true},
    materia: {type: String, required: true},
    alumnos: {type: Array, required: true},
    fecha: {type: String, required: true},
    comision: {type: String, required: true},
    horaInicio: {type: String, required: true},
    horaFinal:{type: String, required: true},
    año: {type: Date, required: true, default: new Date().getFullYear()},
    date: {type: Date, default: Date.now},
}); //esto le dice a la DB como van a ser los datos

module.exports = mongoose.model('Lab', labSchema);