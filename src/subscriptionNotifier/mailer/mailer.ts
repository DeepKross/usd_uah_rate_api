import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: 'mykhailo.tanchuk@ukr.net',
    pass: '2OPbxP4YSJnIe2es'
  }
});

const verity = () => {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Error with SMTP configuration:', error);
    } else {
      console.log('SMTP configuration is correct');
    }
  });
};

export default {
  transporter,
  verity
};
