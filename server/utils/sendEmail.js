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
    html: options.html || undefined,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    throw new Error(
      error.response?.body?.errors?.[0]?.message || 'Failed to send email via SendGrid. Check API Key and Verified Sender Email.'
    );
  }
};

export default sendEmail;
