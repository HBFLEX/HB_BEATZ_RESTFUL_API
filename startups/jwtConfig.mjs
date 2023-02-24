

export default function jwt_config(){
    if(!process.env.jwtPrivateKey){
        console.error('Fatal Error: JWT has not been set!')
        process.exit(1)
    }
}