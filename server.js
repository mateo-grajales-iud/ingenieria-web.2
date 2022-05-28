//Trabajo Ingenieria Web 2
//Carolina Florez
//Mateo Grajales
//IUDigital

const dotenv = require('dotenv').config();
const app = require('./app');

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
    console.log(`Arranca el servidor en el puerto: ${app.get('port')}`)
});