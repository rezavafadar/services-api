import linkSchema, { linkDoc, LinkFindDocument } from '../models/linkModel';

const createLink = (object: linkDoc) => {
	return linkSchema.create(object);
};

const removeLink = (id: string) => {
	return linkSchema.deleteOne({ id });
};

const findUserLink = (userId: string, type: string) => {
	return linkSchema.findOne({ userId, type, status: true });
};

const findLink = (link: string, type: string) => {
	return linkSchema.findOne({ link, type, status: true });
};

const updateLink = (linkId: string, data: linkDoc) => {
	return linkSchema.findByIdAndUpdate(linkId, data);
};

const deactiveLink = (link: string) => {
	return linkSchema.updateOne({ link }, { status: false });
};
export default {
	createLink,
	removeLink,
	findLink,
	updateLink,
	findUserLink,
	deactiveLink,
};
