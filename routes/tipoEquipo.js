const { Router } = require('express');

const router = Router();

const { Pool, Client } = require('pg');

const connectionString = 'postgres://gmwzqtqzboaewb:e5dec37245a1c426e68be5a523da02f5d8b6e744467f95656e9a3af606b29ddf@ec2-52-72-99-110.compute-1.amazonaws.com:5432/dcfb6hfabhfn0q?ssl=no-verify'

const pool = new Pool({
  connectionString,
})

//Prepared Statements para incrementar eficiencia en las busquedas
const todas = {
    name : 'todas-los-tipo-de-equipo',
    text: 'select * from tipo_de_equipo'
}

const getTipoDeEquipoById = {
    name : 'obtener-tipo-de-equipo-by-id',
    text : 'select * from tipo_de_equipo where id = $1',
    values : []
}

const getTipoDeEquipoByName = {
    name : 'obtener-tipo-de-equipo-by-name',
    text : 'select * from tipo_de_equipo where lower(nombre) like lower( $1 )',
    values : []
}

const setNameTipoDeEquipo = {
    name : 'modificar-nombre-tipo-de-equipo',
    text : 'update tipo_de_equipo set nombre = $2 , '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
     values : []
}

const setActiveTipoDeEquipo = {
    name : 'modificar-activo-tipo-de-equipo',
    text : 'update tipo_de_equipo set estado = $2, '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
    values : []
}

const newTipoDeEquipo = {
    name : 'crear-nueva-tipo-de-equipo',
    text : 'insert into tipo_de_equipo(nombre, estado) values($1, $2)',
    values : []
}

const deleteTipoDeEquipo = {
    name : 'borrar-tipo-de-equipo',
    text : 'delete from tipo_de_equipo where id = $1',
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
router.get("/byId/:id", async (req, res) => {
    try {
        getTipoDeEquipoById.values = [ req.params.id ];
        const response = await pool.query(getTipoDeEquipoById);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json(e);
        console.log(e);
    }
});

//obtener por nombre
router.get("/byName/:nombre", async (req, res) => {
    try {
        getTipoDeEquipoByName.values = [ '%' + req.params.nombre + '%' ];
        const response = await pool.query(getTipoDeEquipoByName);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//modificar nombre
router.post("/setName", async (req, res) => {
    try {
        setNameTipoDeEquipo.values = [req.body.id, req.body.nombre];
        const response = await pool.query(setNameTipoDeEquipo)
        res.status(200);
        res.json({ "respuesta" : "se actualizaron " + response.rowCount + " filas"});       
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//modificar activo
router.post("/setStatus", async (req, res) => {
    try {
        setActiveTipoDeEquipo.values = [req.body.id, req.body.estado];
        const response = await pool.query(setActiveTipoDeEquipo)
        res.status(200);
        res.json({ "respuesta" : "se actualizaron " + response.rowCount + " filas"});
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//crear nueva marca
router.post("/new", async (req, res) => {
    try {
        newTipoDeEquipo.values = [req.body.nombre, req.body.estado];
        const response = await pool.query(newTipoDeEquipo)
        res.status(200);
        res.json({ "respuesta" : "se insertaron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//Borrar marca
router.post("/delete", async (req, res) => {
    try {
        deleteTipoDeEquipo.values = [req.body.id];
        const response = await pool.query(deleteTipoDeEquipo)
        res.status(200);
        res.json({ "respuesta" : "se borraron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});


module.exports = router;