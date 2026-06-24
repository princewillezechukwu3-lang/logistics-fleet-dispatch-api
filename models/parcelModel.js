const pool = require('../config/db')

const logParcel = async(destinaion, weight_kg, driver_id, tracking_number) => {
    try{
        const result = await pool.query('INSERT INTO parcels (destination, weight_kg, driver_id, tracking_number) VALUES ($1, $2, $3, $4) RETURNING *;',[destinaion, weight_kg, driver_id, tracking_number]);
        return result.rows[0];
    } catch(error){
        console.error(error);
        throw error
    }
}

const assignParcel = async (driver_id, parcel_id) => {
    const client = await pool.connect(); 
    
    try {
        await client.query('BEGIN'); 

        const parcelQuery = `UPDATE parcels SET driver_id = $1, status = 'Dispatched' WHERE id = $2 RETURNING *;`;
        const parcelResult = await client.query(parcelQuery, [driver_id, parcel_id]);

        const driverQuery = `UPDATE drivers SET status = 'On Delivery' WHERE id = $1;`;
        await client.query(driverQuery, [driver_id]);

        await client.query('COMMIT'); 
        
        return parcelResult.rows[0]; 
    } catch (error) {
        await client.query('ROLLBACK'); 
        throw error; 
    } finally {
        client.release(); 
    }
};

const getParcelByID = async(id) => {
    try{
        const result = await pool.query('SELECT * FROM parcels WHERE id = $1;', [id]);
        return result.rows[0]
    } catch(error){
        console.error(error);
        throw error
    }
}

module.exports = {
    logParcel,
    assignParcel,
    getParcelByID
}