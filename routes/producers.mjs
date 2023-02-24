import express from 'express'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import Producer from '../models/Producer.mjs'
import auth from '../middleware/auth.mjs'
import admin from '../middleware/admin.mjs'

const ERR_404 = 'Genre with the specified ID is not found or removed'

const router = express.Router()

router.get('/', async(req, res) => {
    const producers = await Producer.find({}).sort('name')
    return res.status(200).json({ success: true, data: producers })
})

router.post('/', [auth, admin], async(req, res) => {
    const { errors } = validateProducer(req.body)
    if(errors) return res.status(400).json({ success: false, message: errors.details[0].message })

    const isRegistered = await Producer.findOne({ email: req.body.email })
    if(isRegistered) return res.status(400).json({ success: false, message: "User with that email is already registered" })

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const producer = new Producer({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    })

    // save the hashed password instead
    producer.password = hashedPassword

    await producer.save()
    return res.status(200).json({ success: true, data: producer })
})

router.get('/:id', async(req, res) => {
    const producer = await Producer.findById(req.params.id)
    if(!producer) return res.status(404).json({ success: false, message: ERR_404 })
    return res.status(200).json({ success: true, data: producer })
})

router.put('/:id', [auth, admin], async(req, res) => {
    const { errors } = validateProducer(req.body)
    if(errors) return res.status(400).json({ success: false, message: errors.details[0].message })

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const producer = await Producer.findById(req.params.id)
    if(!producer) return res.status(404).json({ success: false, message: ERR_404 })

    producer.name = req.body.name
    producer.email = req.body.email
    producer.phone = req.body.phone
    producer.password = req.hashedPassword,
    producer.isAdmin = req.body.isAdmin
    
    await producer.save()
    return res.status(200).json({ success: true, data: producer })
})

router.delete('/:id', [auth, admin], async(req, res) => {
    const producer = await Producer.findByIdAndDelete(req.params.id)
    if(!producer) return res.status(404).json({ success: false, message: ERR_404 })
    return res.status(200).json({ success: true, data: producer })
})

const validateProducer = (producer) => {
    const producerSchema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(255).required(),
        phone: Joi.string().min(10).max(10),
        password: Joi.string().min(8).max(255).required(),
        isAdmin: Joi.boolean()
    }

    return Joi.validate(producer, producerSchema)
}


export default router