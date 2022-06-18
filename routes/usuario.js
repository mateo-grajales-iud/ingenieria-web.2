const { Router } = require('express');

const router = Router();

const { Pool, Client } = require('pg');

const connectionString = 'postgres://gmwzqtqzboaewb:e5dec37245a1c426e68be5a523da02f5d8b6e744467f95656e9a3af606b29ddf@ec2-52-72-99-110.compute-1.amazonaws.com:5432/dcfb6hfabhfn0q?ssl=no-verify'

const pool = new Pool({
  connectionString,
})

//Prepared Statements para incrementar eficiencia en las busquedas
const todas = {
    name : 'todas-los-usuario',
    text: 'select * from usuarios'
}

const getUsuarioById = {
    name : 'obtener-usuario-by-id',
    text : 'select * from usuarios where id = $1',
    values : []
}

const getUsuarioByName = {
    name : 'obtener-usuario-by-name',
    text : 'select * from usuarios where lower(nombre) like lower( $1 )',
    values : []
}

const getUsuarioByEmail = {
    name : 'obtener-usuario-by-email',
    text : 'select * from usuarios where lower(email) like lower( $1 )',
    values : []
}

const setNameUsuario = {
    name : 'modificar-nombre-usuario',
    text : 'update usuarios set nombre = $2 , '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
     values : []
}

const setEmailUsuario = {
    name : 'modificar-nombre-usuario',
    text : 'update usuarios set email = $2 , '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
     values : []
}

const setActiveUsuario = {
    name : 'modificar-activo-usuario',
    text : 'update usuarios set estado = $2, '
     + 'fecha_de_actualizacion = current_timestamp '
     + 'where id = $1',
    values : []
}

const newUsuario = {
    name : 'crear-nueva-usuario',
    text : 'insert into usuarios(nombre, estado, email) values($1, $2, $3)',
    values : []
}

const deleteUsuario = {
    name : 'borrar-usuario',
    text : 'delete from usuarios where id = $1',
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
        getUsuarioById.values = [ req.params.id ];
        const response = await pool.query(getUsuarioById);
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
        getUsuarioByName.values = [ '%' + req.params.nombre + '%' ];
        const response = await pool.query(getUsuarioByName);
        res.json(response.rows);
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//obtener por email
router.get("/byEmail/:email", async (req, res) => {
    try {
        getUsuarioByEmail.values = [ '%' + req.params.email + '%' ];
        const response = await pool.query(getUsuarioByEmail);
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
        setNameUsuario.values = [req.body.id, req.body.nombre];
        const response = await pool.query(setNameUsuario)
        res.status(200);
        res.json({ "respuesta" : "se actualizaron " + response.rowCount + " filas"});       
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});

//modificar email
router.post("/setEmail", async (req, res) => {
    try {
        setEmailUsuario.values = [req.body.id, req.body.email];
        const response = await pool.query(setEmailUsuario)
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
        setActiveUsuario.values = [req.body.id, req.body.estado];
        const response = await pool.query(setActiveUsuario)
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
        newUsuario.values = [req.body.nombre, req.body.estado, req.body.email];
        const response = await pool.query(newUsuario)
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
        deleteUsuario.values = [req.body.id];
        const response = await pool.query(deleteUsuario)
        res.status(200);
        res.json({ "respuesta" : "se borraron " + response.rowCount + " filas" });
    } catch (e) {
        res.status(500);
        res.json({ 'error' : e.message, 'detalles' : e });
        console.log(e);
    }
});



module.exports = router;