import nodemailer from 'nodemailer'
import winston from 'winston'
import _ from 'lodash'

export default async function sendMail(receiver, accDetails){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.mailUser,
            pass: process.env.mailPass
        }
    })

    const htmlBody = `
        <h1>Detected log-in activities from hb beats API</h1>
        <p>
            <b>${JSON.stringify(_.pick(accDetails, ['_id', 'name', 'email']))}</b> <br/><br/> these account details were detected to log-in into
            the API on ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}.
        </p>
        <p>
            If this was you, just ignore this message. Otherwise make sure to enforce security protocols.
        </p>

        <small>Kind regards from:</small>
        <p>HB_BEATZ_API, All rights reserved ${new Date().getFullYear()}. </p>
    `

    const mailOptions = {
        to: receiver,
        from: 'hbfl3x@gmail.com',
        subject: 'Log in notification from your hb beats API',
        html: htmlBody
    }

    transporter.sendMail(mailOptions, (err, info) => {
        return err ? winston.error(err.message) : winston.info(info)
    })
}