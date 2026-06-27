const authModel = require('../models/authModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const registerDispatcher = async(req, res, next) => {
    try{
        const {username, password} = req.body;
        if (!username || !password){
            const err = new Error('Username and Password are required')
            err.statusCode=400
            return next(err)
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const register = await authModel.registerDispatcher(username, password_hash);
        res.status(201).json(register)
    } catch(error){
        if (error.code === '23505') {
            const err = new Error('Username is already taken');
            err.statusCode = 409;
            return next(err);
        }
        next(err)
    }
}

const loginDispatcher = async(req, res, next) => {
    try{
        const {username, password} = req.body;
        if (!username || !password){
            const err = new Error('Username and Password are required')
            err.statusCode=400
            return next(err)
        } 

        const user = await authModel.findUserByUsername(username);
        if (!user){
            const err = new Error('Username or password incorrect')
            err.statusCode=401
            return next(err)
        }

        const checkPassword = await bcrypt.compare(password, user.password_hash)
        if (!checkPassword){
            const err = new Error('Username or password incorrect');
            err.statusCode=401
            return next(err)
        }

        const tokenPayload = {
            id:user.id
        }

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            {'expiresIn': '1h'}
        )

        delete user.password_hash

        res.status(200).json({
            message: 'Login Successful',
            token:token,
            user:user,
        })

    } catch(error){
        next(error)
    }
}

module.exports = {
    registerDispatcher,
    loginDispatcher
}