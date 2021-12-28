const express = require ('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');



//INITIALIZATION
const app = express();
require('./database');

//SETTINGS
app.set('port', process.env.port || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    default: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

//MIDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next(); //para que no se quede aca colgado y siga con las siguientes tareas
});

//ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/student'));
//app.use(require('./routes/laboratorios'));
app.use(require('./routes/calificacion'));
app.use(require('./routes/certificacion'));
app.use(require('./routes/tpg'));


//STATIC VARIABLES
app.use(express.static(path.join(__dirname, 'public')));

//SERVER IS LISTENING
app.listen(app.get('port'),() => {
    console.log('Server on port', app.get('port'));
});