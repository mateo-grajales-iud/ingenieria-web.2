const { Router } = require('express');

const router = Router();

const { Pool, Client } = require('pg');

const pool = new Pool();

//Prepared Statements para incrementar eficiencia en las busquedas
const todas = {
    name : 'todas-los-estado-de-equipo',
    text: 'select * from estado_de_equipo'
}

const getEstadoDeEquipoById = {
    name : 'obtener-estado-de-equipo-by-id',
    text : 'select * from estado_de_equipo where id = $1',
    values : []
}

const getEstadoDeEquipoByName = {
    name : 'obtener-estado-de-equipo-by-name',
    text : 'select * from estado_de_equipo where lower(nombre) like lower( $1 )',
    values : []
}

const setNameEstadoDeEquipo = {
    name : 'modificar-nombre-estado-de-equipo',
    text : 'update estado_de_equipo set nombre = $2 , '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
     values : []
}

const setActiveEstadoDeEquipo = {
    name : 'modificar-activo-estado-de-equipo',
    text : 'update estado_de_equipo set estado = $2, '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
    values : []
}

const newEstadoDeEquipo = {
    name : 'crear-nueva-estado-de-equipo',
    text : 'insert into estado_de_equipo(nombre, estado) values($1, $2)',
    values : []
}

const deleteEstadoDeEquipo = {
    name : 'borrar-estado-de-equipo',
    text : 'delete from estado_de_equipo where id = $1',
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
        getEstadoDeEquipoById.values = [ req.params.id ];
        const response = await pool.query(getEstadoDeEquipoById);
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
        getEstadoDeEquipoByName.values = [ '%' + req.params.nombre + '%' ];
        const response = await pool.query(getEstadoDeEquipoByName);
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
        setNameEstadoDeEquipo.values = [req.body.id, req.body.nombre];
        const response = await pool.query(setNameEstadoDeEquipo)
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
        setActiveEstadoDeEquipo.values = [req.body.id, req.body.estado];
        const response = await pool.query(setActiveEstadoDeEquipo)
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
        newEstadoDeEquipo.values = [req.body.nombre, req.body.estado];
        const response = await pool.query(newEstadoDeEquipo)
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
        deleteEstadoDeEquipo.values = [req.body.id];
        const response = await pool.query(deleteEstadoDeEquipo)
        res.status(200);
        res.json({ "respuesta" : "se borraron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

module.exports = router;