import nodemailer from 'nodemailer'

export const sendConfirmationEmail = function ({toUser, hash}) {
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_PASSWORD
            }
        })
        const message = {
            from: process.env.GOOGLE_USER,
            to: process.env.GOOGLE_USER,
            subject: 'Codex Software - Confirm your account',
            html: `<p>Hello ${toUser.name},</p>
                   <p>Please confirm your account by clicking the link below:</p>     
                   <a href="${process.env.SERVER_URL}/confirm/${hash}">Confirm</a>
                   <p>Thank you!</p>
                   <p>Codex Software</p>  
                   `

        }
        transporter.sendMail(message, (err, info) => {
            if (err) rej(err)
            else res(info)
        })
    })
}
