const express = require('express');
const router = express.Router();
const Calificacion1 = require('../models/calificacion1');
const Student = require('../models/student');
const Calificacion2 = require('../models/calificacion2');
const TPG = require ('../models/tpg');

/////////////////// INFO 1 ///////////////////////

router.get('/calificacion/info1', (req, res) => {
    res.render('calificacion/info1');
});

router.get('/calificacion/notasinfo1/:id', async (req, res) => {
    const idAlumno= req.params.id;
    const Alumno = await Student.findById(idAlumno).lean();
    var notas = await Calificacion1.findOne({alumno: idAlumno}).lean();
    const idNota = notas._id.toString();
    //console.log(notas);
    res.render('calificacion/notasinfo1', {idAlumno, notas, Alumno, idNota});
});

router.put('/calificacion/save-notas1/:idNota', async (req, res) => {
    const idNotas = req.params.idNota;
    var {p1, p2, recp1, recp2, ext, lab1, lab2, reclab12, lab3, lab4, reclab34} = req.body;
    const notas = await Calificacion1.findById(idNotas);
    if(p1){
        recp1= p1>=50 ? "N/A" : "";
    };
    if(p2){
        recp2= p2>=50 ? "N/A" : "";
        if((notas.p1>=50 && p2>=50)||(notas.recp1>=50 && p2>=50)){
            ext = "N/A";
        };
    };
    if(recp2){
        if((notas.p1>=50 && recp2>=50)||(notas.recp1>=50 && recp2>=50)){
            ext = "N/A";
        }
    }
    if(lab2=="Ap"){
        if(notas.lab1=="Ap"){
            reclab12="N/A";
        }
    };
    if(lab4=="Ap"){
        if(notas.lab3=="Ap"){
            reclab34="N/A";
        }
    }; 
    await Calificacion1.findByIdAndUpdate(idNotas, {p1, p2, recp1, recp2, ext, lab1, lab2, reclab12, lab3, lab4, reclab34});

    req.flash('success_msg', 'Se calificó satisfactoriamente');
    res.redirect ('/calificacion/info1');
});

////////////// INFO 2 /////////////

router.get('/calificacion/info2', (req, res) => {
    res.render('calificacion/info2');
});

router.get('/calificacion/notasinfo2/:id', async (req, res) => {
    const idAlumno= req.params.id;
    const Alumno = await Student.findById(idAlumno).lean();
    var notas = await Calificacion2.findOne({alumno: idAlumno}).lean();
    const idNota = notas._id.toString();
    //console.log(notas);
    res.render('calificacion/notasinfo2', {idAlumno, notas, Alumno, idNota});
});

router.put('/calificacion/save-notas2/:idNota', async (req, res) => {
    const idNotas = req.params.idNota;
    var {p1, p2, recp1, recp2, ext, lab1, lab2, reclab12, lab3, lab4, reclab34} = req.body;
    const notas = await Calificacion2.findById(idNotas);
    if(p1){
        recp1= p1>=50 ? "N/A" : "";
    };
    if(p2){
        recp2= p2>=50 ? "N/A" : "";
        if((notas.p1>=50 && p2>=50)||(notas.recp1>=50 && p2>=50)){
            ext = "N/A";
        };
    };
    if(recp2){
        if((notas.p1>=50 && recp2>=50)||(notas.recp1>=50 && recp2>=50)){
            ext = "N/A";
        }
    }
    if(lab2=="Ap"){
        if(notas.lab1=="Ap"){
            reclab12="N/A";
        }
    };
    if(lab4=="Ap"){
        if(notas.lab3=="Ap"){
            reclab34="N/A";
        }
    }; 
    await Calificacion2.findByIdAndUpdate(idNotas, {p1, p2, recp1, recp2, ext, lab1, lab2, reclab12, lab3, lab4, reclab34});

    req.flash('success_msg', 'Se calificó satisfactoriamente');
    res.redirect ('/calificacion/info2');
});

router.get('/calificacion/tpg',async  (req, res) => {
    const code = req.query.code;
    var TPGS = [];
    var bget1 ="";
    var bget2 ="";
    var bget3 ="";
    var bget4 ="";
    if(code =='info1'){
        var condicion = {materia: 'info1'};
        var mat = 'Informática 1 / Computación 1';
    };
    if(code == 'info2') {
        var condicion = {materia: 'info2'};
        var mat = 'Informática 2 / Computación 2';
    };
    var tpgs = await TPG.find(condicion).sort({grupo: 'asc'}).lean();
    for (let i = 0; i < tpgs.length; i++) {
        if(tpgs[i].et1=="Ap"){
            bget1 = "table-success"
        }else{
            if(tpgs[i].et1=="Rep"){
                bget1 = "table-danger";
            }else{
                bget1="";
            }
        }
        if(tpgs[i].et2=="Ap"){
            bget2 = "table-success"
        }else{
            if(tpgs[i].et2=="Rep"){
                bget2 = "table-danger";
            }else{
                bget2="";
            }
        }
        if(tpgs[i].et3=="Ap"){
            bget3 = "table-success"
        }else{
            if(tpgs[i].et3=="Rep"){
                bget3 = "table-danger";
            }else{
                bget3="";
            }
        }
        if(tpgs[i].et4=="Ap"){
            bget1 = "table-success"
        }else{
            if(tpgs[i].et4=="Rep"){
                bget4 = "table-danger";
            }else{
                bget4="";
            }
        }
        TPGS.push({_id: tpgs[i]._id, grupo: tpgs[i].grupo, et1: tpgs[i].et1, et2: tpgs[i].et2, et3: tpgs[i].et3, et4: tpgs[i].et4, bget1: bget1, bget2: bget2, bget3: bget3, bget4: bget4})
    }
    res.render('calificacion/tpg', {TPGS, mat});
});

router.get('/calificacion/notastpg/:id', async (req, res) => {
    const id = req.params.id;
    var notas = await TPG.findById(id).lean();
    res.render('calificacion/notastpg', {notas});
});

router.put('/calificacion/save-tpg/:id', async (req, res) => {
    const id = req.params.id;
    const grupotpg = await TPG.findById(id);
    const {et1, et2, et3, et4} = req.body;
    await TPG.findByIdAndUpdate(id, {et1, et2, et3, et4});
    req.flash('success_msg', 'Se calificó satisfactoriamente');
    res.redirect(`/calificacion/tpg?code=${grupotpg.materia}`);
});


module.exports = router;