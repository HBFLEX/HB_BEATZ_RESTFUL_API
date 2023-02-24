import { Schema, model } from "mongoose";
import { CategorySchema } from './Category.mjs'
import { GenreSchema } from './Genre.mjs'


const TrackSchema = new Schema({
    name: { type: String, minlength: 5, maxlength: 255, required: true, lowercase: true, unique: true },
    length: { type: String, minlength: 1, maxlength: 10 },
    beatUrl: { type: String, required: true, maxlength: 2014, unique: true },
    coverUrl: { type: String, maxlength: 2014 },
    tags: { type: [String] },
    category: { type: CategorySchema, required: true },
    producer: { type: new Schema({
        name: { type: String, minlength: 3, maxlength: 50, lowercase: true }
    }), required: true},
    genre: { type: GenreSchema, required: true }
})

const Track = model('Track', TrackSchema)

export default Track