import express from 'express'
import Joi from 'joi'
import { Category } from '../models/Category.mjs'
import auth from '../middleware/auth.mjs'
import admin from '../middleware/admin.mjs'


const ERR_404 = 'Genre with the specified ID is not found or removed'

const router = express.Router()

router.get('/', async(req, res) => {
    const categories = await Category.find({}).sort('name')
    return res.status(200).json({ success: true, data: categories })
})

router.post('/', [auth, admin], async(req, res) => {
    const { error } = validateCategory(req.body)
    if(error) return res.status(400).json({ success: false, message: error.details[0].message })

    const category = new Category({
        name: req.body.name
    })

    await category.save()
    return res.status(200).json({ success: true, data: category })
})

router.get('/:id', async(req, res) => {
    const category = await Category.findById(req.params.id)
    if(!category) return res.status(404).send(ERR_404)
    return res.status(200).json({ success: true, data: category })
})

router.put('/:id', [auth, admin], async(req, res) => {

    const { error } = validateCategory(req.body)
    if(error) return res.status(400).json({ success: false, message: error.details[0].message })

    const category = await Category.findByIdAndUpdate(req.params.id, {
        $set:{
            name: req.body.name
        }
    }, { new: true })

    if(!category) return res.status(404).send(ERR_404)
    return res.status(200).json({ success: true, data: category })
})

router.delete('/:id', [auth, admin], async(req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if(!category) return res.status(404).json({ success: false, message: ERR_404 })
    return res.status(200).json({ success: true, data: category })
})

const validateCategory = (category) => {
    const categorySchema = {
        name: Joi.string().min(1).max(50).required()
    }
    return Joi.validate(category, categorySchema)
}


export default router