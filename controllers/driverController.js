const driverModel = require('../models/driverModel');

const onboardDriver = async(req, res, next) => {
    try{
        const {name, license_number} = req.body;
        if (!name || !license_number){
            const err = new Error('Missing Input');
            err.statusCode = 400;
            return next(err);
        }
        const onboard = await driverModel.onboardDriver(name, license_number);
        res.status(201).json(onboard);
    } catch(error){
        next(error)
    }
}

const getDriverByID = async(req, res, next) => {
    try{
        const {id} = req.params;
        const getDriver = await driverModel.getDriverByID(id);
        if (!getDriver){
            const err = new Error ('Driver not found');
            err.statusCode = 404;
            return next(err);
        }
        res.status(200).json(getDriver)
    } catch(error){
        next(err)
    }
}

const driverManifest = async(req, res, next) => {
    try{
        const result = await driverModel.driverManifest();
        res.status(200).json(result)
    } catch(error){
        next(err)
    }
}

const transferCargo = async (req, res, next) => {
    try{
        const {sender_driver_id, receiver_driver_id} = req.body
        const checkSenderID = await driverModel.getDriverByID(sender_driver_id)
        const checkReceiverID = await driverModel.getDriverByID(receiver_driver_id)
        if (!checkSenderID || !checkReceiverID){
            const err = new Error ('ID Not Found');
            err.statusCode=404
            return next(err)
        }
        const result = await driverModel.transferCargo(sender_driver_id, receiver_driver_id)
        res.status(200).json(result)
    } catch(error){
        next(err)
    }
}

module.exports = {
    onboardDriver,
    getDriverByID,
    driverManifest,
    transferCargo
}