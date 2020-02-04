export default {
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Gobarber - Não Responda <noreply@gobarber.io>',
  },
};

/*
Servidores de emailS
Amazon SES
Mailgun
Sparkpost
Mandrill(Mailchimp)
*/
