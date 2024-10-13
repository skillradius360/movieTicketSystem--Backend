import nodemailer from "nodemailer"

async function sendMessage(from,to,appPassword,subject,content,html="<></>") {
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: `${from}`,
    pass: `${appPassword}`,//oohr syfi xati qjrk
  },
});



 try {
   
     // send mail with defined transport object
     const info = await transporter.sendMail({
       from: `"raj 👻" <${from}>`, // sender address
       to: `${to}`, // list of receivers
       subject: subject, // Subject line
       text: content, // plain text body
       html: html // html body
     });
   
     console.log("Message sent: %s", info.messageId);
     return info.messageId

 } catch (error) {
  console.log("some error occured while sending message")
 }
  }

export default sendMessage