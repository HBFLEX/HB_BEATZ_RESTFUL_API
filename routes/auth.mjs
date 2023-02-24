import express from 'express'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import mailer from '../services/mailer.mjs'
import winston from 'winston'
import Producer from '../models/Producer.mjs'


const router = express.Router()


router.post('/', async(req, res) => {
    const { errors } = validateAuth(req.body)
    if(errors) return res.status(400).json({ success: false, message: errors.details[0].message })

    const user = await Producer.findOne({ email: req.body.email })
    if(!user) return res.status(404).json({ success: false, message: 'Invalid email or password' })

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordValid) return res.status(400).json({ success: false, message: 'Invalid email or password' })

    // generate token
    const token = user.generateAuthToken()

    // send email if logged in successfully
    try{
        mailer(user.email, user)
    }catch(err){
        winston.error(err.message)
    }
    
    return res.header('x-auth-token', token).status(200).json({ success: true, data: token })
})


const validateAuth = (auth) => {
    const authSchema = {
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(auth, authSchema)
}

export default router