const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/catedrainfo', {
    //useCreateIndex: true, //no soportado en la version nueva de node
    useNewUrlParser: true,
    //useFindAndModify: false, //no soportado en la version nueva de node
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err));