const mongoose = require('mongoose');
const {Schema} = mongoose;

const tpgSchema = new Schema({
    grupo: {type: String, required: true},
    materia: {type: String, required: true},
    alumnos: {type: Array, required: true},
    et1: {type: String, required: false},
    et2: {type: String, required: false},
    et3: {type: String, required: false},
    et4: {type: String, required: false},
    date: {type: Date, default: Date.now}
}); //esto le dice a la DB como van a ser los datos

module.exports = mongoose.model('TPG', tpgSchema);