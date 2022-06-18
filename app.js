const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const estadoEquipo = require('./routes/estadoEquipo');
const inventario = require('./routes/inventario');
const marcas = require('./routes/marcas');
const tipoEquipo = require('./routes/tipoEquipo');
const usuario = require('./routes/usuario');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api/estadoEquipo", estadoEquipo);
app.use("/api/inventario", inventario);
app.use("/api/marcas", marcas);
app.use("/api/tipoEquipo", tipoEquipo);
app.use("/api/usuario", usuario);

module.exports = app;