const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const TPG = require('../models/tpg');
const puppeteer = require('puppeteer');


router.get('/tpg', (req, res) =>{
    const code = req.query.code;
    res.render('tpg/tpg', {code});

});

router.get('/tpg/get-student', async (req, res) => {
    const code = req.query.code;
    if(code=="info1"){
        var condicion = {$and:[{info1: true}, {tpgi1:false}]};
    };
    if(code=="info2"){
        var condicion = {$and:[{info2: true}, {tpgi2:false}]};
    };
    const student= await Student.find(condicion).sort({apellido: 'asc'}).lean();
    res.json(student);
});

router.post('/tpg/save', async (req, res) => {
    const materia = req.query.code;
    if(materia == "info1"){
        var options = {tpgi1: true};
    }
    if(materia == "info2"){
        var options = {tpgi2: true};
    }
    const {alumnos, grupoTPG} = req.body;
    var grupo = grupoTPG;
    const newTPG = new TPG({grupo, materia, alumnos});
    await newTPG.save();
    alumnos.forEach(async alum => {
        await Student.findByIdAndUpdate(alum, options);
    });
    res.status(200).send('ok');
});
 router.get('/tpg/grupostpg', (req, res) => {
     const code = req.query.code;
     var asignatura = '';
     if(code =='info1'){
        asignatura = 'Informática 1 / Computación 1';
     };
     if(code =='info2'){
        asignatura = 'Informática 2 / Computación 2';
     };
     var dirPDF = `/tpg/get-pdf?code=${code}`
     res.render('tpg/grupostpg', {code, asignatura, dirPDF});
 });

 router.get('/tpg/grupos-students', async (req, res) => {
     const code = req.query.code;
     if(code=="info1"){
        var condicion = {$and:[{info1: true}, {tpgi1:true}]};
    };
    if(code=="info2"){
        var condicion = {$and:[{info2: true}, {tpgi2:true}]};
    };
    const student= await Student.find(condicion).sort({apellido: 'asc'}).lean();
    res.json(student);
 })

 router.get('/tpg/get-grupos', async (req, res) => {
    const code = req.query.code;
    const grupos = await TPG.find({materia: code}).sort({grupo: 'asc'}).lean();
    res.json(grupos);
 });
 router.get('/tpg/get-pdf', (req, res) => {
    const code = req.query.code;
    const createPDF = async () =>{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const options = {
            path: `TPG-${code}.pdf`,
            format: 'A4',
            printBackground: false,
            landscape: true,
            displayHeaderFooter: true,
            margin: {
                top: '2cm',
                right: '0',
                bottom: '2cm',
                left: '0'
            }
            
        };
        await page.goto(`http://localhost:5000/tpg/grupos-pdf?code=${code}`, {waitUntil: 'networkidle2'});
        await page.pdf(options);

        await browser.close();
        req.flash('success_msg', 'PDF generado satisfactoriamente');
        res.redirect(`/tpg/grupostpg?code=${code}`);
    };
    createPDF();
 });
 router.get('/tpg/grupos-pdf', async (req, res) => {
    const code = req.query.code;
    if(code == 'info1') {
        var condStud = {tpgi1: true};
        var condTPG ={materia: 'info1'};
        var materia = 'Informática 1 / Computación 1'
    };
    if(code == 'info2') {
        var condStud = {tpgi2: true};
        var condTPG ={materia: 'info2'};
        var materia = 'Informática 2 / Computación 2'
    };
    var studTPG = await Student.find(condStud).sort({apellido: 'asc'}).lean();
    var grupoTPG = await TPG.find(condTPG).sort({grupo: 'asc'}).lean();
    var datos = [];
    for (let i = 0; i < grupoTPG.length; i++) {
        for (let j = 0; j < grupoTPG[i].alumnos.length; j++) {
            var participante = studTPG.find( persona => persona._id == grupoTPG[i].alumnos[j]);
            datos.push({grupo:grupoTPG[i].grupo, apellido:participante.apellido, nonmbre: participante.nombre, carrera: participante.carrera, registro: participante.registro, dni: participante.dni, et1: grupoTPG[i].et1, et2: grupoTPG[i].et2, et3:grupoTPG[i].et3, et4: grupoTPG[i].et4})
        };
    };
    res.render('pdf/pdf-tpg', {materia, datos});
 });

router.get('/tpg/edit/:id', async (req, res) => {
    const id = req.params.id;
    const grupo = await TPG.findById(id).lean();
    if(grupo.materia=='info1'){
        var mat = 'Computación 1 / Informática 1';
    }
    if(grupo.materia=='info2'){
        var mat = 'Computación 2 / Informática 2';
    }
    res.render('tpg/edit', {grupo, mat});

}) 

module.exports = router;