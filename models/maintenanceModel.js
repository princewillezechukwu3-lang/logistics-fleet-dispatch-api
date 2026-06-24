const pool = require('../config/db');

const newLog = async(vehicle_type, scheduled_date, driver_id, ticket_number) => {
    try{
        const result = await pool.query(`INSERT INTO maintenance_logs (vehicle_type, scheduled_date, driver_id, ticket_number) VALUES ($1, $2, $3, $4) RETURNING *`, [vehicle_type, scheduled_date, driver_id, ticket_number]);
        return result.rows[0]
    }catch(error){
        console.error(error);
        throw error
    }
}


module.exports = {
    newLog
}