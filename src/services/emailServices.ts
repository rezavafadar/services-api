import nodemailer from 'nodemailer';

const transporterConfig = {
	host: process.env.EMAIL_HOST,
	port: 587,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	secure: false,
};

const transporter = nodemailer.createTransport(transporterConfig);

const sendWlcEmail = (userEmail: string, url: string) => {
	transporter
		.sendMail({
			from: process.env.EMAIL_USER,
			to: userEmail,
			subject: 'Hello Freind,..',
			text: `Welcome to Services Api,..
            you can use of services..
    
            We are very happy for your registration :')
            `,
			html: `
            <p>Your email has been used to register on the site, if you have not done so, click on the link below.</p>
            <a href=${url}>I'm not ! </a>
            `,
		})
		.catch((error) => console.log(error));
};

const sendForgotPassEmail = (username: string, url: string) => {
	return transporter.sendMail({
		from: process.env.EMAIL_USER,
		to: username,
		subject: 'forgot password',
		text: `click link for reset password:
        ${url}
        `,
	});
};

const sendEmailVerify = (userEmail: string, url: string) => {
	return transporter.sendMail({
		from: process.env.EMAIL_USER,
		to: userEmail,
		subject: 'Verify Your Email',
		text: `
        Link for your verify : ${url}
        `,
	});
};

export default {
	sendWlcEmail,
	sendEmailVerify,
	sendForgotPassEmail,
};
