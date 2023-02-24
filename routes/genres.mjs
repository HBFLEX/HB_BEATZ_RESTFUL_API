import express from 'express'
import Joi from 'joi'
import { Genre } from '../models/Genre.mjs'
import auth from '../middleware/auth.mjs'
import admin from '../middleware/admin.mjs'

const router = express.Router()

const ERR_404 = 'Genre with the specified ID is not found or removed'

router.get('/', async(req, res) => {
    const genres = await Genre.find({}).sort('name')
    return res.status(200).json({ success: true, data: genres })
})

router.post('/', [auth, admin], async(req, res) => {

    const { error } = validateGenre(req.body)

    if(error) return res.status(400).json({ success: false, message: error.details[0].message })

    const newGenre = new Genre({ name: req.body.name }) 

    await newGenre.save()
    return res.status(200).json({ success: true, data: newGenre })

})

router.get('/:id', async(req, res) => {
    const genre = await Genre.findById(req.params.id)

    if(!genre) return res.status(404).json({ success: false, message: ERR_404 })
    return res.status(200).json({ success: true, data: genre })
})


router.put('/:id', [auth, admin], async(req, res) => {

    const { error } = validateGenre(req.body)

    if(error) return res.status(400).json({ success: false, message: error.details[0].message })

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set:{
            name: req.body.name
        }
    }, { new: true })

    if(!genre) return res.status(404).json({ success: false, message: ERR_404 })
    return res.status(200).json({ success: true, data: genre })
})

router.delete('/:id', [auth, admin], async(req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    
    if(!genre) return res.status(404).json({ success: false, message: ERR_404 })
    return res.status(200).json({ success: true, data: genre })
})

const validateGenre = (genre) => {
    const genreSchema = {
        name: Joi.string().min(3).max(50).required()
    }

    return Joi.validate(genre, genreSchema)
}

export default router