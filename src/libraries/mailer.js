const nodemailer = require('nodemailer');
const {
  ADMIN_EMAIL,
  ADMIN_PASS,
  ADMIN_PORT,
  DEV_EMAIL,
  DEV_PASS,
  DEV_POP_IMAP_SERVER,
//   devPopImapPort,
//   devSmtpServer,
  DEV_SMTP_PORT,
  USE_TRANSPORT = 'fsl_uat'
} = require('../config');

const transports = {
  fsl_uat: {
    service: 'gmail',
    port: ADMIN_PORT,
    secure: true,
    auth: {
      user: ADMIN_EMAIL,
      pass: ADMIN_PASS
    }
  },
}

const useTransport = transports[USE_TRANSPORT];

let transport = nodemailer.createTransport(useTransport);

module.exports = transport;

// Removed example code - YAGNI