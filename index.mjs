import express from 'express'
import dotenv from 'dotenv'
import Joi from 'joi'
import joiObjectid from 'joi-objectid'
Joi.objectId = joiObjectid(Joi)

import endpoints from './startups/endpoints.mjs'
import MongoDB from './startups/mongodb.mjs'
import express_middleware from './startups/express_middlewares.mjs'
import winston_config from './startups/winston_config.mjs'
import jwt_config from './startups/jwtConfig.mjs'

// initialised dotenv
if(process.env.ENV === "development") dotenv.config()

// checking if the JWT env var is set before app startup
jwt_config()

// initialised express
const app = express()

// winston logging config
winston_config()

// initialised mongodb connection
MongoDB()

// setting up express built-in middlewares
express_middleware(app, express)

// endpoints
endpoints(app)

// setting up env variables
const PORT = process.env.PORT || 5000

// listening on a port
app.listen(PORT, console.log(`Listening on port: ${PORT}`))