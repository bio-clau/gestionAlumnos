const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Laboratorios = require('../models/laboratorios');
const puppeteer = require('puppeteer');



router.get('/laboratorios/labinfo1', (req, res) => {
    res.render('laboratorios/labinfo1');
});
router.get('/laboratorios/labinfo2', (req, res) => {
    res.render('laboratorios/labinfo2');
});
 router.get('/laboratorios/get-student', async (req, res) => {
     var code = req.query.code;
     var cond ='';
     if(code=="info1"){
         cond={info1:true};
     }else{
        cond={info2:true};
     }
    const students = await Student.find(cond).lean();
    res.json(students);
 });
router.post('/laboratorios/save-labinfo', async (req, res) => {
    var {alumnos, numlab, fecha, comision, horaInicio, horaFinal} = req.body;
    var materia = req.query.mat;
    const newLab = new Laboratorios({numlab, materia, alumnos, fecha, comision, horaInicio, horaFinal});
    await newLab.save();
    var labId = newLab._id.toString();


    const createPDF = async () =>{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const options = {
            path: `Comision${comision}de${materia}.pdf`,
            format: 'A4',
            printBackground: false,
            landscape: true,
            displayHeaderFooter: true,
            margin: {
                top: '0cm',
                right: '0',
                bottom: '0cm',
                left: '0'
            }
            
        };
        await page.goto(`http://localhost:5000/laboratorios/get-pdflab?id=${labId}`, {waitUntil: 'networkidle2'});
        await page.pdf(options);

        await browser.close();
        req.flash('success_msg', 'PDF generado satisfactoriamente');
        res.status(200);
    };
    createPDF();

    res.status(200).send('ok');
});
router.get('/laboratorios/get-pdflab', async (req, res) => {
    const id = req.query.id;
    var labDato = await Laboratorios.findById(id).lean();
    if(labDato.materia == 'info1'){
        labDato.materia = 'Computación I (ELO) / Informática I (BIO)';
    }
    if(labDato.materia == 'info2'){
        labDato.materia = 'Computación II (ELO) / Informática II (BIO)';
    }
    var alumnos = [];
    for (let i = 0; i < labDato.alumnos.length; i++) {
        const idAlumno = labDato.alumnos[i];
        var num = i+1;
        var datoAlumno = await Student.findById(idAlumno);
        alumnos.push({num:num,nombre: datoAlumno.nombre, apellido: datoAlumno.apellido, carrera: datoAlumno.carrera, registro: datoAlumno.registro, dni:datoAlumno.dni});
        
    }
    res.render('pdf/get-pdf',{labDato, alumnos});
});



module.exports = router;