import nodemailer from 'nodemailer';
import sendGridTransport from 'nodemailer-sendgrid-transport';

export const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);
