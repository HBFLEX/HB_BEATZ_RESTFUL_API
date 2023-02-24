import { Schema, model } from 'mongoose'


const GenreSchema = new Schema({
    name: { type: String, required: true, maxlength: 50 }
})

const Genre = model('Genre', GenreSchema)

export { Genre, GenreSchema }