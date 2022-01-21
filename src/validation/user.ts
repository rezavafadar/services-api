import * as yup from 'yup';

interface UserValidation {
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
}

const userSchema: yup.SchemaOf<UserValidation> = yup.object().shape({
	email: yup
		.string()
		.required('Email is required !')
		.email('Email is incorrect !'),
	username: yup
		.string()
		.required('Username is required !')
		.min(5, 'Username should not be shorter than 4 characters !')
		.max(15, 'Username should not exceed 15 characters!'),
	password: yup
		.string()
		.required('Password is Required !')
		.min(6, 'Password Should not be shorter than 6 characters !'),
	confirmPassword: yup
		.string()
		.required('ConfirmPassword is required !')
		.oneOf([yup.ref('password'), null], 'Passwords do not match !'),
});

type Body = yup.InferType<typeof userSchema>;

const validateBody = async (body: Body) => {
	try {
		await userSchema.validate(body, { abortEarly: false });
	} catch (error) {
		if (error instanceof yup.ValidationError && error.errors)
			return error.errors;
	}
};
export default validateBody;
