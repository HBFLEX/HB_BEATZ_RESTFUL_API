import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'

export default function express_middleware(app, express){
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    if(process.env.ENV === 'development') app.use(morgan())
    app.use(compression())
    app.use(helmet())
}