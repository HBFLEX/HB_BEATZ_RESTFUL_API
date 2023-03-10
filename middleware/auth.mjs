import jwt from 'jsonwebtoken'


const auth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send('Access Denied, No JWT provided.')

    try{
        const decodedValidToken = jwt.verify(token, process.env.jwtPrivateKey)
        req.user = decodedValidToken
        next()
    }catch(exc){
        return res.status(400).send('Invalid JWT.')
    }
}

export default auth