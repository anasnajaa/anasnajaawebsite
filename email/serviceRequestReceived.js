const mailer = require('../util/mailer');
const accounts = require('./accounts');

const htmlTemplate = ({ name, serviceTitle })=>{
    return `
    Dear <i>${name}</i>,<br/>
    Thank you for considering my <b>${serviceTitle}</b> service.<br/>
    I'll get in touch with you as soon as possible, usually in less than two business days.<br/><br/>
    All the best,<br/>
    Anas Najaa`;
}

const textTemplate = ({ name, serviceTitle })=>{
    return `
    Dear ${name},\n
    Thank you for considering my ${serviceTitle} service.\n
    I'll get in touch with you as soon as possible, usually in less than two business days.\n
    All the best,\n
    Anas Najaa`;
}

module.exports = async ({ email, name, serviceTitle }) => {
    return await mailer.sendMail({
        from: accounts.support,
        to: email,
        subject: "Service Request Received",
        html: htmlTemplate({ name, serviceTitle }),
        text: textTemplate({ name, serviceTitle })
    }, "email sent");
};