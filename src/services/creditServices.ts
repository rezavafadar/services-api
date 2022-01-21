import creditCodeSchema, { CreditDocument } from '../models/creditCodeModel';
import { UserDocument } from '../models/userModel';
import userService from './userServices';

interface CreateCode {
	code: string;
	amount: number;
}

const createCreditCode = (code: string, amount: number) => {
	return creditCodeSchema.create({ code, amount });
};

const findCreditCode = (code: string) => {
	return creditCodeSchema.findOne({ code, status: true });
};

const findCreditCodeById = (id: string) => {
	return creditCodeSchema.findOne({ _id: id, status: true });
};

const findAllCreditCodes = () => {
	return creditCodeSchema.find({});
};

const updateCreditCode = (code: string, data: object) => {
	return creditCodeSchema.updateOne({ code }, data);
};

const deleteCreditCode = (id: string) => {
	return creditCodeSchema.updateOne({ _id: id }, { status: false });
};

const createCode = async (data: CreateCode): Promise<any> => {
	const currentCreditCode: CreditDocument = await findCreditCode(data.code);

	if (currentCreditCode)
		return { errorCode: 401, message: 'Credit code already exists' };

	return createCreditCode(data.code, data.amount);
};

const applyCode = async (userId: string, code: string): Promise<any> => {
	const creditCode: CreditDocument = await findCreditCode(code);

	if (!creditCode)
		return { errorCode: 401, message: 'Credit code is not defined!' };

	const codeUsers = creditCode.users;
	if (codeUsers.includes(userId))
		return { errorCode: 402, message: 'This code has been used before' };

	const currentUser: UserDocument = await userService.findUserById(userId);

	const newCredit = (currentUser.credit += creditCode.amount);

	await userService.updateUser(userId, { credit: newCredit });

	return updateCreditCode(code, { users: [...codeUsers, userId] });
};

export default {
	createCreditCode,
	findCreditCode,
	createCode,
	applyCode,
	deleteCreditCode,
	findCreditCodeById,
	findAllCreditCodes,
};
