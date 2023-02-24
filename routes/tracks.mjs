import express from 'express'
import Joi from 'joi'
import Track from '../models/Track.mjs'
import Producer from '../models/Producer.mjs'
import { Category } from '../models/Category.mjs'
import { Genre } from '../models/Genre.mjs'
import auth from '../middleware/auth.mjs'
import admin from '../middleware/admin.mjs'


const router = express.Router()

router.get('/', async(req, res) => {
    const tracks = await Track.find({}).sort('name')
    res.status(200).json({ success: true, data: tracks })
})

router.post('/', [auth, admin], async(req, res) => {
    const { errors } = validateTrack(req.body)
    if(errors) return res.status(400).json({ success: false, message: errors.details[0].message })

    const producer = await Producer.findById(req.body.producer)
    if(!producer) return res.status(404).json({ success: false, message: "Producer with the specified ID was not found or removed" })

    const category = await Category.findById(req.body.category)
    if(!category) return res.status(404).json({ success: false, message: "Category with the specified ID was not found or removed" })

    const genre = await Genre.findById(req.body.genre)
    if(!genre) return res.status(404).json({ success: false, message: "Genre with the specified ID was not found or removed" })

    const track = new Track({
        name: req.body.name,
        length: req.body.length,
        beatUrl: req.body.beatUrl,
        coverUrl: req.body.coverUrl,
        tags: req.body.tags,
        category: {
            _id: category._id,
            name: category.name
        },
        producer: {
            _id: producer._id,
            name: producer.name
        },
        genre: {
            _id: genre._id,
            name: genre.name
        }
    })

    await track.save()
    return res.status(200).json({ success: true, data: track })
})

router.get('/:id', async(req, res) => {
    const track = await Track.findById(req.params.id)
    if(!track) return res.status(404).json({ success: false, message: "Track with the specified ID was not found" })
    return res.status(200).json({ success: true, data: track })
})

router.put('/:id', async(req, res) => {

    const { errors } = validateTrack(req.body)
    if(errors) return res.status(400).json({ success: false, message: errors.details[0].message })

    const category = await Category.findById(req.body.category)
    if(!category) return res.status(404).json({ success: false, message: 'Category with that specified ID was not found or removed' })

    const producer = await Producer.findById(req.body.producer)
    if(!producer) return res.status(404).json({ success: false, message: 'Producer with that specified ID was not found or removed' })

    const genre = await Genre.findById(req.body.genre)
    if(!genre) return res.status(404).json({ success: false, message: 'Genre with that specified ID was not found or removed' })

    const track = await Track.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            length: req.body.length,
            beatUrl: req.body.beatUrl,
            coverUrl: req.body.coverUrl,
            tags: req.body.tags,
            category: {
                _id: categpry._id,
                name: category.name
            },
            producer: {
                _id: producer._id,
                name: producer.name
            },
            genre: {
                _id: genre._id,
                name: genre.name
            }
        }
    }, { new: true })

    if(!track) return res.status(404).json({ success: false, message: 'Track with that specified ID was not found or removed' })
})

router.delete('/:id', [auth, admin], async(req, res) => {
    const track = await Track.findByIdAndRemove(req.params.id)
    if(!track) return res.status(404).json({ success: false, message: "Track with the specified ID was not found" })
    return res.status(200).json({ success: true, data: track })
})

const validateTrack = (track) => {
    const trackSchema = {
        name: Joi.string().min(5).max(255).required(),
        length: Joi.string().min(1).max(10),
        beatUrl: Joi.string().min(5).max(2014).required(),
        coverUrl: Joi.string().min(5).max(2014),
        tags: Joi.array(),
        category: Joi.objectId().required(),
        producer: Joi.objectId().required(),
        genre: Joi.objectId().required()
    }
    return Joi.validate(track, trackSchema)
}

export default router