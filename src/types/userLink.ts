export interface CreateUserLink {
	type: 'forgotPassword' | 'verifyEmail';
	link: string;
	userId: string;
	status?: boolean;
	expired?: Date;
}

export interface GetUserLink extends CreateUserLink {
	status: boolean;
	expired: Date;
}
