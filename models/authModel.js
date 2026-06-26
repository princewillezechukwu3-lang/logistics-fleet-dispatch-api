const pool = require('../config/db')

const registerDispatcher = async(username, password) => {
    try{
        const result = await pool.query('INSERT INTO dispatchers (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at;', [username,password])
        return result.rows[0]
    } catch(error){
        console.error(error);
        throw error
    }
}

const findUserByUsername = async(username) => {
    try{
        const result = await pool.query('SELECT * FROM dispatchers WHERE username = $1', [username])
        return result.rows[0]
    } catch(error){
        console.error(error);
        throw error
    }
}


module.exports = {
    registerDispatcher,
    findUserByUsername
}