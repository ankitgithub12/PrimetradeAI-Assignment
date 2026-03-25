import sgMail from '@sendgrid/mail';

const sendEmail = async (options) => {
  if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your_sendgrid_api_key_here') {
    console.log('Sending mock email due to missing SendGrid Key: ', options);
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    subject: options.subject,
    text: options.message,
  };

  await sgMail.send(msg);
};

export default sendEmail;
