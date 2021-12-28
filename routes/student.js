const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Calificacion1 = require('../models/calificacion1');
const Calificacion2 = require('../models/calificacion2');

router.get('/student/add', (req, res) => {
    res.render('student/new-student');
});

router.post('/student/new-student', async (req, res) => {
    var {nombre, apellido, carrera, registro, dni, email, materia} = req.body;
    const errors = [];
    var info1 = false;
    var info2 = false;
    if(!nombre) {
        errors.push({text: 'Por favor, escriba el nombre del alumno'});
    }
    if(!apellido) {
        errors.push({text: 'Por favor, escriba el apellido del alumno'})
    }
    if(!carrera) {
        errors.push({text: 'Por favor, escriba la carrera del alumno'})
    }
    if(!materia) {
        errors.push({text: 'Por favor, seleccione la materia en la que será matriculado el alumno'});
    }
    if(!email) {
        errors.push({text: 'Por favor, escriba el Email del alumno'})
    }
    if(errors.length>0) {
        res.render('student/new-student', {
            errors,
            nombre,
            apellido,
            carrera,
            registro,
            dni,
            email
        });
    } else {
        const emailEst = await Student.findOne({email: email});
        if (emailEst){
            errors.push({text: 'El email ingresado ya pertenece a un estudiante.'})
            res.render('student/new-student', {
                errors,
                nombre,
                apellido,
                carrera,
                registro,
                dni,
                email
            });
        }else{
            if(materia=="info1") {
                info1 = true;
            }
            if(materia=="info2") {
                info2 = true;
            }
            carrera = carrera.toUpperCase();
            const newStudent = new Student({nombre, apellido, carrera, registro, dni, email, info1, info2});
            await newStudent.save();
            const {_id} = await Student.findOne({email:email});
            const alumno = _id.toString();
            const newNotas1 = new Calificacion1({alumno});
            await newNotas1.save();
            const newNotas2 = new Calificacion2({alumno});
            await newNotas2.save();
            req.flash('success_msg', 'Alumno agregado satisfactoriamente');
            res.redirect('/student/add');
        }
    }
});

router.get('/student/search', async (req, res) => {
    //const students = await Student.find().lean();
    res.render('student/search');
});

router.get('/student/edit/:id', async (req, res) => {
    const student = await Student.findById(req.params.id).lean();
    res.render('student/edit-student', {student});
});
router.put('/student/edit-student/:id', async (req, res) => {
    const {nombre, apellido, carrera, registro, dni, email}= req.body;
    await Student.findByIdAndUpdate(req.params.id, {nombre, apellido, carrera, registro, dni, email}); 
    req.flash('success_msg', 'El alumno fue editado satisfactoriamente');
    res.redirect ('/student/search');
});
router.put('/info1/update/:id', async (req, res) => {
    const {nombre, apellido, carrera, registro, dni, email, info1}= req.body;
    await Student.findByIdAndUpdate(req.params.id, {nombre, apellido, carrera, registro, dni, email, info1});
    const students = await Student.find().lean();
    res.json(students);
});

router.put('/info2/update/:id', async (req, res) => {
    const {nombre, apellido, carrera, registro, dni, email, info2}= req.body;
    await Student.findByIdAndUpdate(req.params.id, {nombre, apellido, carrera, registro, dni, email, info2});
    const students = await Student.find().lean();
    res.json(students);
});

router.get('/student/delete/:id', async (req, res) => {
    const student = await Student.findById(req.params.id).lean();
    res.render('student/delete-student', {student});
});

router.delete ('/student/delete-student/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Alumno eliminado satisfactoriamente');
    res.redirect('/student/search');
});
router.get('/student/matricula-info1', async (req, res) => {
    const students = await Student.find().lean();
    res.render('student/matricula-info1', {students});
});
router.get('/student/matricula-info2', async (req, res) => {
    const students = await Student.find().lean();
    res.render('student/matricula-info2', {students});
});

router.get('/student/get-student', async (req, res) => {
    const students = await Student.find().lean();
    res.json(students)
})

module.exports = router;