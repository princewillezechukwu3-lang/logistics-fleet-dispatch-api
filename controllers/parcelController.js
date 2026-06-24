const parcelModel = require('../models/parcelModel')
const driverModel = require('../models/driverModel')
const crypto = require('crypto')


const generateTrackingID = () => {
    const prefix = 'TRK';
    const year = new Date().getFullYear();

    const randonHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${year}-${randonHex}`
}


const logParcel = async(req, res, next) => {
    try{
        const {destination, weight_kg, driver_id} = req.body
        if (!weight_kg || !destination){
            const err = new Error('Missing Input');
            err.statusCode = 400;
            return next(err)
        }
        if (driver_id){
            const driver = await driverModel.getDriverByID(driver_id)
            if (!driver){
                const err = new Error('Driver id is invalid');
                err.statusCode = 404;
                return next(err);
            }
        }
        const tracking_number = generateTrackingID()
        const logP = await parcelModel.logParcel(
            destination,
            weight_kg,
            driver_id || null,
            tracking_number
        )
        res.status(201).json(logP)
    } catch(error){
        next(err)
    }
}

const assignParcel = async(req, res, next) => {
    try{
        const {id} = req.params;
        const {driver_id} = req.body;
        const parcel = await parcelModel.getParcelByID(id);
        if(!parcel){
            const err = new Error('Parcel not found');
            err.statusCode = 404;
            return next(err)
        }
        if (parcel.status === 'Dispatched'){
            const err = new Error('Parcel has already been dispatched');
            err.statusCode=400;
            return neext(err);
        }
        const driver = await driverModel.getDriverByID(driver_id);
        if (!driver){
            const err = new Error('Driver not found');
            err.statusCode = 404;
            return next(err)
        }
        if (driver.status === 'On Delivery' || driver.status === 'Suspended'){
            const err = new Error('Driver is currently unavailable for delivery assignments');
            err.statusCode=400;
            return next(err);
        }
        const assignP = await parcelModel.assignParcel(driver_id, id);
        res.status(200).json(assignP)
    } catch(error){
        next(err)
    }
}

module.exports = {
    logParcel,
    assignParcel
}