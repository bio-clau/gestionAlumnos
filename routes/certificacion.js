const express = require('express');
const router = express.Router();
const Calificacion1 = require('../models/calificacion1');
const Student = require('../models/student');
const Calificacion2 = require('../models/calificacion2');
const puppeteer = require('puppeteer');


router.get('/certificacion/cert-parc', (req, res) =>{
    const code = req.query.code;
    var dir="";
    switch (code) {
        case "info1bio":
            dir = 'certificacion/parc-bio-info1';       
            break;
        case "info1elo":
            dir = 'certificacion/parc-elo-info1';       
            break;
        case "info2elo":
            dir = 'certificacion/parc-elo-info2';       
            break;
        case "info2bio":
            dir = 'certificacion/parc-bio-info2';       
            break;
        default:
            break;
    };
    res.render(dir);
})

router.get('/certificacion/get-alumnos', async(req, res) => {
    const code = req.query.code;
    var mat ={};
    var carr = {};
    switch (code) {
        case "info1bio":
            mat = {info1: true};
            carr={carrera:"BIO"};       
            break;
        case "info1elo":
            mat = {info1: true};
            carr={carrera:"ELO"};       
            break;
        case "info2elo":
            mat = {info2: true};
            carr={carrera:"ELO"};       
            break;
        case "info2bio":
            mat = {info2: true};
            carr={carrera:"BIO"};       
            break;
        default:
            break;
    }
    const students = await Student.find({$and:[mat, carr]}).lean();
    res.json(students);
});
router.get('/certificacion/get-notas', async (req, res)=>{
    const code = req.query.code;
    var nota=[];
    var mat ={};
    var carr = {};
    switch (code) {
        case "info1bio":
            mat = {info1: true};
            carr={carrera:"BIO"};
            nota= await Calificacion1.find().lean();      
            break;
        case "info1elo":
            mat = {info1: true};
            carr={carrera:"ELO"};
            nota= await Calificacion1.find().lean();    
            break;
        case "info2elo":
            mat = {info2: true};
            carr={carrera:"ELO"};
            nota= await Calificacion2.find().lean();    
            break;
        case "info2bio":
            mat = {info2: true};
            carr={carrera:"BIO"};
            nota= await Calificacion2.find().lean();    
            break;    
        default:
            break;
    }
    
    const students = await Student.find({$and:[mat, carr]}).lean();
    var notas = [];
    students.forEach(async alumno => {
        var id = alumno._id.toString();
        nota.forEach(cadauno => {
            if (cadauno.alumno == id){
                notas.push(cadauno);
            }
        });
    });
    res.json(notas);
});

router.get('/pdf/notas-info1bio', async (req, res) => {

    const students = await Student.find({$and:[{info1: true}, {carrera:"BIO"}]}).sort({apellido:'asc'}).lean();
    const nota= await Calificacion1.find().lean();
    let datos=[];
    for (let i = 0; i < students.length; i++) {
        const id = students[i]._id.toString();
        const student = students[i];
        var alumno = nota.find(persona => persona.alumno == id);
        datos.push({apellido:student.apellido,nombre: student.nombre,registro: student.registro,dni: student.dni,p1: alumno.p1,p2: alumno.p2,recp1: alumno.recp1,recp2: alumno.recp2,ext: alumno.ext,lab1: alumno.lab1,lab2: alumno.lab2,lab3: alumno.lab3,lab4: alumno.lab4,reclab12: alumno.reclab12,reclab34: alumno.reclab34});
    };
    var materia = "Informática 1";
    var carrera = "Bioingeniería";
    res.render('pdf/pdf-notas', {datos, materia, carrera});
})
router.get('/certificacion/get-pdf', async (req, res) =>{
    const code=req.query.code;
    var dir ="";
    var nextDir ="";
    switch (code) {
        case "info1bio":
            dir = "http://localhost:5000/pdf/notas-info1bio";
            nextDir =  "certificacion/parc-bio-info1";       
            break;
        case "info1elo":
            dir = "http://localhost:5000/pdf/notas-info1elo";
            nextDir =  "/certificacion/parc-elo-info1";       
            break;
        default:
            break;
    }
    const createPDF = async () =>{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const options = {
            path: `${code}.pdf`,
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
        await page.goto(dir, {waitUntil: 'networkidle2'});
        await page.pdf(options);

        await browser.close();
        req.flash('success_msg', 'PDF generado satisfactoriamente');
        res.render(nextDir);
    };
    createPDF();
    
});



module.exports = router;