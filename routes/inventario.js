const { Router } = require('express');

const router = Router();

const { Pool, Client } = require('pg');

const connectionString = 'postgres://gmwzqtqzboaewb:e5dec37245a1c426e68be5a523da02f5d8b6e744467f95656e9a3af606b29ddf@ec2-52-72-99-110.compute-1.amazonaws.com:5432/dcfb6hfabhfn0q?ssl=no-verify'

const pool = new Pool({
  connectionString,
})

//Prepared Statements para incrementar eficiencia en las busquedas
const todas = {
    name : 'todas-el-inventario',
    text: 'select * from inventario'
}

const getBySerial = {
    name : "inventario-por-serial",
    text: 'select * from inventario where serial = $1',
    values: []
}

const getByModelo = {
    name : "inventario-por-modelo",
    text: 'select * from inventario where lower(modelo) = lower($1)',
    values: []
}

const getByColor = {
    name : "inventario-por-color",
    text: 'select * from inventario where lower(color) = lower($1)',
    values: []
}

const getByFechaDeCompra = {
    name : "inventario-por-fecha-de-compra",
    text: 'select * from inventario where fecha_de_compra = $1',
    values: []
}

const getByUsuario = {
    name : "inventario-por-usuario",
    text: 'select * from inventario where usuario_a_cargo = $1',
    values: []
}

const getByMarca = {
    name : "inventario-por-marca",
    text: 'select * from inventario where marca = $1',
    values: []
}

const getByEstado = {
    name : "inventario-por-estado",
    text: 'select * from inventario where estado_del_equipo = $1',
    values: []
}

const getByTipo = {
    name : "inventario-por-tipo",
    text: 'select * from inventario where tipo_de_equipo = $1',
    values: []
}

const ingresarInventario = {
    name : 'ingresar-inventario',
    text : 'insert into inventario('
         + 'serial, modelo, descripcion, foto_del_equipo, color, fecha_de_compra, precio, usuario_a_cargo, marca, estado_del_equipo, tipo_de_equipo) '
         + 'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    values : []
}

const actualizarInventario = {
    name : 'update-inventario',
    text : 'update inventario '
            + 'set usuario_a_cargo = $2, '
            + 'estado_del_equipo = $3, '
            + 'foto_del_equipo = $4 '
            + "where serial = $1",
    values : []
}

const borrarInventario = {
    name : 'borrar_inventario',
    text : 'delete from inventario where serial = $1',
    values : []
}

//obtener todos
router.get("/", async (req, res) => {
    try {
        const response = await pool.query(todas);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

//obtener por id
router.get("/bySerial/:serial", async (req, res) => {
    try {
        getBySerial.values = [ req.params.serial ];
        const response = await pool.query(getBySerial);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

router.get("/byModelo/:modelo", async (req, res) => {
    try {
        getByModelo.values = [ req.params.modelo ];
        const response = await pool.query(getByModelo);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

router.get("/byColor/:color", async (req, res) => {
    try {
        getByColor.values = [ req.params.color ];
        const response = await pool.query(getByColor);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

router.get("/byFechaDeCompra/:fecha", async (req, res) => {
    try {
        getByFechaDeCompra.values = [ req.params.fecha ];
        const response = await pool.query(getByFechaDeCompra);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

router.get("/byUsuario/:usuario", async (req, res) => {
    try {
        getByUsuario.values = [ req.params.usuario ];
        const response = await pool.query(getByUsuario);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

router.get("/byMarca/:marca", async (req, res) => {
    try {
        getByMarca.values = [ req.params.marca ];
        const response = await pool.query(getByMarca);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

router.get("/byEstado/:estado", async (req, res) => {
    try {
        getByEstado.values = [ req.params.estado ];
        const response = await pool.query(getByEstado);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

router.get("/byTipo/:tipo", async (req, res) => {
    try {
        getByTipo.values = [ req.params.tipo ];
        const response = await pool.query(getByTipo);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

//insertar inventario
router.post("/add", async (req, res) => {
    try {
        ingresarInventario.values = 
            [req.body.serial, 
            req.body.modelo, 
            req.body.descripcion, 
            req.body.fotoDelEquipo, 
            req.body.color, 
            req.body.fechaDeCompra, 
            req.body.precio, 
            req.body.usuarioACargo, 
            req.body.marca, 
            req.body.estadoDelEquipo, 
            req.body.tipoDeEquipo];
        const response = await pool.query(ingresarInventario)
        res.status(200);
        res.json({ "respuesta" : "se ingresaron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//actualizar inventario
router.post("/update", async (req, res) => {
    try {
        actualizarInventario.values = 
            [req.body.serial, 
            req.body.usuarioACargo, 
            req.body.estadoDelEquipo,
            req.body.fotoDelEquipo];
        const response = await pool.query(actualizarInventario)
        res.status(200);
        res.json({ "respuesta" : "se actualizaron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//borrar inventario
router.post("/update", async (req, res) => {
    try {
        borrarInventario.values = 
            [req.body.serial];
        const response = await pool.query(borrarInventario)
        res.status(200);
        res.json({ "respuesta" : "se borraron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

module.exports = router;