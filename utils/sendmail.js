const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

/**
 *
 * @param {string} filename
 * @param {Object} params
 * @returns
 */
const renderFileContents = async (filename, params) => {
  const filePath = path.resolve(
    path.join(process.env.EMAIL_TEMAPLATES_DIR, filename)
  );
  const renderedContents = await ejs.renderFile(filePath, {
    ...params,
  });
  return renderedContents;
};

/**
 *
 * @param {Object} params
 *
 * @param {string} params.subject
 * @param {string} params.senderName
 * @param {string} params.recieverName
 * @param {string} params.recieverEmailId
 * @param {('verification')} params.templateName
 * @param {Object} params.templateParams
 *
 * @returns {nodemailer.SentMessageInfo}
 *
 */
const sendMail = async (params) => {
  const mailContents = await renderFileContents(
    params.templateName + ".ejs",
    params.templateParams
  );

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Team Dropin" <support@dropin.com>', // sender address
    to: params.recieverEmailId, // list of receivers
    subject: params.subject, // Subject line
    html: mailContents, // html body
  });

  return info;
};

module.exports = { sendMail };
