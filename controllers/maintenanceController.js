const maintenanceModel = require('../models/maintenanceModel')
const crypto = require('crypto')


const generateTicketNumber = () => {
    const prefix = `MNT`;
    const year = new Date().getFullYear();
    const hex = crypto.randomBytes(4).toString('hex').toUpperCase()
    return `${prefix}-${year}-${hex}`
}

const newLog = async(req, res, next) => {
    try{
        const {vehicle_type, scheduled_date, driver_id} = req.body;
        if (!vehicle_type || !scheduled_date || !driver_id){
            const err = new Error('Missing Input')
            err.statusCode = 400
            return next(err)
        }
        const ticket_number = generateTicketNumber();
        const today = new Date()
        const scheduledDate = new Date(scheduled_date)

        if (scheduledDate < today){
            const err = new Error('Scheduled date is past')
            err.statusCode=400
            return next(err)
        }
        const log = await maintenanceModel.newLog(vehicle_type, scheduled_date, driver_id, ticket_number)
        res.status(201).json(log)
    } catch(error){
        next(err)
    }
}



module.exports = {
    newLog
}