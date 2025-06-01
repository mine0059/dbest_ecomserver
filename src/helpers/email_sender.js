const nodeMailer = require('nodemailer');

exports.sendMail = async (email, subject, body, successMessage) => {
    const transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: body,
    };
   return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return resolve({ message: 'Error Sending mail', statusCode: 500 });
        } 
        console.log('Email sent successfully:', info.response);
       return resolve({ message: successMessage, statusCode: 200 });
    });
   });
}