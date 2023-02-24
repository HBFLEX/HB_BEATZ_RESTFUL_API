import winston from 'winston'
import 'winston-mongodb'


export default function winston_config(){
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }))
    winston.add(new winston.transports.File({ filename: 'logs.log', level: 'error' }))
    winston.add(new winston.transports.MongoDB({ db: process.env.mongodbConn, collection: 'logs', level: 'error' }))

    // handling exceptions
    process.on('uncaughtException', (err)=>{
        winston.error(err.message, err)
    })
}