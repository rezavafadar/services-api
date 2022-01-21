import hashServices from './hashServices';
import linkServices from './userLinkServices';
import userService from './userServices';

import { UserDocument } from '../types/user';
import { CreateUser } from '../types/user';
import { CreateUserLink, GetUserLink } from '../types/userLink';

const register = async (userData: any): Promise<any> => {
	const currentUser: UserDocument = await userService.findUserByUsernameOrEmail(
		userData.username
	);

	if (currentUser)
		return {
			code: 401,
			message: 'There is a user with this profile',
		};

	const hashPassword: string = await hashServices.hash(userData.password);

	const user: CreateUser = {
		...userData,
		...{ password: hashPassword },
	};

	return userService.createUser(user);
};

const illegalEmail = async (token: string): Promise<any> => {
	const userToken: UserDocument = await userService.findIllegalEmail(token);

	if (!userToken) return { code: 404, message: 'Token is incorrect !' };

	return userService.deleteUser(userToken.id);
};

const login = async (user: UserDocument): Promise<any> => {
	const currentUser: UserDocument = await userService.findUserByUsernameOrEmail(
		user.username
	);

	if (!currentUser) return { code: 404, message: 'User is not defined!' };

	const isMatch = await hashServices.compare(
		user.password,
		currentUser.password
	);

	if (!isMatch) return { code: 400, message: 'Invalid password or username !' };

	currentUser.password = '';
	currentUser.illegalEmail = '';

	return currentUser;
};

const getVerifyEmail = async (email: string, link: string): Promise<any> => {
	const user: UserDocument = await userService.findUserByUsernameOrEmail(email);

	if (!user) return { code: 404, message: 'User is not defined!' };

	if (user.isEmailVerify)
		return { code: 401, message: 'Your Email is active !' };

	const currentLink: GetUserLink =
		await linkServices.findUserLinkByUserIdAndType(user.id, 'verifyEmail');

	if (currentLink) {
		if (currentLink.expired < new Date(Date.now())) {
			await linkServices.deactiveLink(currentLink.link);
		} else {
			return {
				code: 401,
				message: 'You have just taken action. please try again later',
			};
		}
	}

	const linkData: CreateUserLink = {
		link,
		type: 'verifyEmail',
		userId: user.id,
	};

	return linkServices.createLink(linkData);
};

const confirmEmail = async (userLink: string): Promise<any> => {
	const link: GetUserLink = await linkServices.findUserLinkByLinkAndType(
		userLink,
		'verifyEmail'
	);

	if (link) {
		if (link.expired < new Date(Date.now())) {
			await linkServices.deactiveLink(link.link);
			return { code: 401, message: 'Link is expired !' };
		}
	} else {
		return { code: 404, message: 'Link is incorrect Or link is expired !' };
	}

	await linkServices.deactiveLink(link.link);

	return userService.updateUser(link.userId, { isEmailVerify: true });
};

const forgotPassword = async (username: string, link: string): Promise<any> => {
	const user: UserDocument = await userService.findUserByUsernameOrEmail(
		username
	);

	if (!user) return { code: 404, message: 'User is not defined !' };

	const currentLink: GetUserLink =
		await linkServices.findUserLinkByUserIdAndType(user.id, 'forgotPassword');

	if (currentLink) {
		if (currentLink.expired < new Date(Date.now())) {
			await linkServices.deactiveLink(currentLink.link);
		} else {
			return {
				code: 401,
				message: 'You have just taken action. please try again later',
			};
		}
	}

	const linkData: CreateUserLink = {
		type: 'forgotPassword',
		userId: user.id,
		link,
	};

	return linkServices.createLink(linkData);
};

const resetPassword = async (
	userLink: string,
	password: string
): Promise<any> => {
	const link: GetUserLink = await linkServices.findUserLinkByLinkAndType(
		userLink,
		'forgotPassword'
	);

	if (link) {
		if (link.expired < new Date(Date.now())) {
			await linkServices.deactiveLink(link.link);
			return { code: 401, message: 'Link is expired !' };
		}
	} else {
		return { code: 404, message: 'Link is incorrect Or link is expired !' };
	}

	await linkServices.deactiveLink(link.link);

	const hashPassword = await hashServices.hash(password);

	return userService.updateUser(link.userId, { password: hashPassword });
};

export default {
	register,
	login,
	forgotPassword,
	resetPassword,
	getVerifyEmail,
	confirmEmail,
	illegalEmail,
};
