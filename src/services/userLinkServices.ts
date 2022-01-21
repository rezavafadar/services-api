import linkSchema from '../models/userLinkModel';

import { CreateUserLink } from '../types/userLink';

const createLink = (link: CreateUserLink) => {
	return linkSchema.create(link);
};

const findUserLinkByUserIdAndType = (userId: string, type: string) => {
	return linkSchema.findOne({ userId, type, status: true });
};

const findUserLinkByLinkAndType = (link: string, type: string) => {
	return linkSchema.findOne({ link, type, status: true });
};

const updateLink = (linkId: string, data: any) => {
	return linkSchema.findByIdAndUpdate(linkId, data);
};

const deactiveLink = (link: string) => {
	return linkSchema.updateOne({ link }, { status: false });
};

const removeLink = (id: string) => {
	return linkSchema.deleteOne({ id });
};
export default {
	createLink,
	findUserLinkByLinkAndType,
	findUserLinkByUserIdAndType,
	updateLink,
	deactiveLink,
	removeLink,
};
