const pool = require('../config/db')

const onboardDriver = async(name, license_number) => {
    try{
        const result = await pool.query('INSERT INTO drivers (name, license_number) VALUES ($1, $2) RETURNING *;', [name, license_number]);
        return result.rows[0];
    } catch(error){
        console.error(error);
        throw error
    }
}

const getDriverByID = async(driver_id) => {
    try{
        const result = await pool.query('SELECT * FROM drivers WHERE id = $1;',[driver_id]);
        return result.rows[0]
    } catch(error){
        console.error(error);
        throw error
    }
}

const assignDriver = async(id) => {
    try{
        const result = await pool.query(`UPDATE drivers SET status = 'On Delivery' WHERE id = $1;`, [id]);
        return result.rows[0]
    } catch(error){
        console.error(error);
        throw error
    }
}

const driverManifest = async() => {
    try{
        const querytext = `SELECT d.*, array_agg(p.tracking_number) FILTER (WHERE p.status = 'Dispatched') AS parcel_list FROM drivers d LEFT JOIN parcels p ON d.id = p.driver_id GROUP BY d.id ORDER BY d.id ASC;`;
        const result = await pool.query(querytext);
        return result.rows
    } catch(error){
        console.error(error);
        throw error
    }
}


const transferCargo = async(sender_driver_id, receiver_driver_id) => {
    const client = await pool.connect(); 

    try {
        await client.query('BEGIN');
        const updateIDtext = `UPDATE parcels SET driver_id = $1 WHERE driver_id = $2 AND status = 'Dispatched' RETURNING *;`
        const res = await client.query(updateIDtext, [receiver_driver_id, sender_driver_id]);

        const updateSenderText = `UPDATE drivers SET status = 'Available' WHERE id = $1;`;
        await client.query(updateSenderText, [sender_driver_id]);

        const updateReceiverText = `UPDATE drivers SET status = 'On Delivery' WHERE id = $1;`;
        await client.query(updateReceiverText, [receiver_driver_id]);

        await client.query('COMMIT');
        return res.rows;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }

}



module.exports = {
    onboardDriver,
    getDriverByID,
    assignDriver,
    driverManifest,
    transferCargo
}