import mongoose from 'mongoose'
import winston from 'winston'

export default function  MongoDB(){
    mongoose.connect(process.env.mongodbConn)
        .then(() => winston.info(`MongoDB connected: ${mongoose.connection.host}`))
        .catch((err) => winston.error(`There was a problem connecting to MongoDB: ${err}`))
}