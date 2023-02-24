import { Schema, model } from "mongoose";
import jwt from 'jsonwebtoken'

const ProducerSchema = new Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50, lowercase: true },
    email: { type: String, minlength: 4, maxlength: 255, required: true, unique: true },
    phone: { type: String, minlength: 10, maxlength: 10, unique: true },
    password: { type: String, minlength: 8, maxlength: 255, required: true },
    isAdmin: { type: Boolean }
})

ProducerSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin }, process.env.jwtPrivateKey)
    return token
}

const Producer = model('Producer', ProducerSchema)

export default Producer