import { Schema, model } from 'mongoose'


const CategorySchema = new Schema({
    name: { type: String, required: true, maxlength: 50 }
})


const Category = model('Category', CategorySchema)


export { Category, CategorySchema }