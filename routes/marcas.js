const { Router } = require('express');

const router = Router();

const { Pool, Client } = require('pg');

const pool = new Pool();

//Prepared Statements para incrementar eficiencia en las busquedas
const todas = {
    name : 'todas-las-marcas',
    text: 'select * from marcas'
}

const getMarcaById = {
    name : 'obtener-marca',
    text : 'select * from marcas where id = $1',
    values : []
}

const getMarcaByName = {
    name : 'obtener-marca',
    text : 'select * from marcas where lower(nombre) like lower( $1 )',
    values : []
}

const setNameMarca = {
    name : 'modificar-nombre-marca',
    text : 'update marcas set nombre = $2 , '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
     values : []
}

const setActiveMarca = {
    name : 'modificar-activo-marca',
    text : 'update marcas set estado = $2, '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
    values : []
}

const newMarca = {
    name : 'crear-nueva-marca',
    text : 'insert into marcas(nombre, estado) values($1, $2)',
    values : []
}

const deleteMarca = {
    name : 'borrar-marca',
    text : 'delete from marcas where id = $1',
    values : []
}

//obtener todas las marcas
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
        getMarcaById.values = [ req.params.id ];
        const response = await pool.query(getMarcaById);
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
        getMarcaByName.values = [ '%' + req.params.nombre + '%' ];
        const response = await pool.query(getMarcaByName);
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
        setNameMarca.values = [req.body.id, req.body.nombre];
        const response = await pool.query(setNameMarca)
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
        setActiveMarca.values = [req.body.id, req.body.estado];
        const response = await pool.query(setActiveMarca)
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
        newMarca.values = [req.body.nombre, req.body.estado];
        const response = await pool.query(newMarca)
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
        deleteMarca.values = [req.body.id];
        const response = await pool.query(deleteMarca)
        res.status(200);
        res.json({ "respuesta" : "se borraron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

module.exports = router;