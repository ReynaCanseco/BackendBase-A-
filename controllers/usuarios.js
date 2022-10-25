const { request, response } = require("express");
const pool = require("../db/connection")
const getUsers = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD
    
    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        //esta es la consulta mas basica, se pueden hacer mas complejas
        const users = await conn.query("SELECT * FROM Usuarios", (error) => {throw new Error(error) })
        //siempre validar que no se obtuvieron resultados
        if (!users) {
            res.status(404).json({msg:"no se encontraron registros"})
            return
        }
        res.json({users})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}

const getUserByID = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD
    const {id} = req.params
    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        //esta es la consulta mas basica, se pueden hacer mas complejas
        const [user] = await conn.query(`SELECT * FROM Usuarios WHERE ID = ${id}`, (error) => {throw new Error(error) })
        //siempre validar que no se obtuvieron resultados
        if (!user) {
            res.status(404).json({msg: `No se encontró registro con el ID ${id}`})
            return
        }
        res.json({user})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}

const deleteUserByID = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD
    const {id} = req.query
    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        //esta es la consulta mas basica, se pueden hacer mas complejas
        const {affectedRows} = await conn.query(`UPDATE Usuarios SET Activo = 'N' WHERE ID = ${id}`, (error) => {throw new Error(error) })
        //siempre validar que no se obtuvieron resultados
        if (!affectedRows === 0) {
            res.status(404).json({msg: `No se pudo eliminar el registro con el ID ${id}`})
            return
        }
 
        res.json({msg: `El usuario con ID ${id} se eliminó sastifactoriamente. `})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}

const addUser = async (req = request, res = response) =>{
    //estructura basica de cualquier endpoint al conectar en su BD
    const {
        Nombre,
        Apellidos,
        Edad,
        Genero,
        Usuario,
        Contrasena,
        Fecha_Nacimiento,
        Activo
    } = req.body

    if (
        !Nombre ||
        !Apellidos ||
        !Edad ||
        !Genero ||
        !Usuario ||
        !Contrasena ||
        !Fecha_Nacimiento ||
        !Activo
    ){
        res.status(400).json({msg: "Falta información del usuario"})
        return
    }

    let conn;
    //control de exepciones
    try {
        conn = await pool.getConnection()
        //esta es la consulta mas basica, se pueden hacer mas complejas
        const {affectedRows} = await conn.query(`
        INSERT INTO Usuarios (
            Nombre,
            Apellidos,
            Edad,
            Genero,
            Usuario,
            Contrasena,
            Fecha_Nacimiento,
            Activo
        ) VALUES (
            '${Nombre}',
            '${ Apellidos}',
            '${Edad}',
            '${Genero}',
            '${Usuario}',
            '${Contrasena}',
            '${Fecha_Nacimiento}',
            '${Activo}'
        )
        `, (error) => {throw new Error(error) })
        //siempre validar que no se obtuvieron resultados
        if (!affectedRows === 0) {
            res.status(404).json({msg: `No se pudo agregar el registro del Usuario ${Usuario}`})
            return
        }
 
        res.json({msg: `El usuario ${Usuario} se agrego sastifactoriamente. `})
        //lo del cath y final siempre sera lo mismo
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }finally{
        if(conn){
            conn.end()
        }
    }
}
module.exports = {getUsers, getUserByID, deleteUserByID ,addUser}