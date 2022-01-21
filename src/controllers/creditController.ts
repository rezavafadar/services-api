import { isValidObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

import creditServices from '../services/creditServices';
import AppError from '../utils/appError';

import { UserInRequest } from '../types/user';

const createCode = async (req: Request, res: Response, next: NextFunction) => {
	const body = req.body;
	if (!body.code || !body.amount)
		return next(
			new AppError('Bad Request!', 400, ['Code or Amount is not defined !'])
		);

	const createCodeResult = await creditServices.createCode({
		code: body.code,
		amount: body.amount,
	});

	if (createCodeResult.errorCode)
		return next(new AppError(createCodeResult.message, createCodeResult.code));

	const code = {
		code: createCodeResult.code,
		amount: createCodeResult.amount,
		expiresTime: createCodeResult.expiresTime,
	};

	res.status(200).json({ message: 'succesfull', data: code });
};

const applyCode = async (
	req: UserInRequest,
	res: Response,
	next: NextFunction
) => {
	const code = req.params.code;

	if (!code)
		return next(
			new AppError('Bad Request!', 400, ['Credit code is required !'])
		);

	const applyCodeResult = await creditServices.applyCode(req.user.id, code);

	if (applyCodeResult.errorCode)
		return next(new AppError(applyCodeResult.message, applyCodeResult.code));

	res.status(200).json({ message: 'successfull!' });
};

const deleteCode = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;

	if (!id || !isValidObjectId(id))
		return next(
			new AppError('Bad Request!', 400, [
				'Code Id is not defined or id is incorrect !',
			])
		);

	await creditServices.deleteCreditCode(id);

	res.status(200).json({ message: 'successful!' });
};

const getCode = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;

	if (!id || !isValidObjectId(id))
		return next(
			new AppError('Bad Request!', 400, [
				'Code Id is not defined or id is incorrect !',
			])
		);

	const code = await creditServices.findCreditCodeById(id);

	return res.status(200).json({ message: 'successful!', data: code });
};

const getAllCode = async (req: Request, res: Response, next: NextFunction) => {
	const codes = await creditServices.findAllCreditCodes();

	res.status(200).json({ message: 'successful!', data: codes });
};

export default {
	createCode,
	applyCode,
	deleteCode,
	getCode,
	getAllCode,
};
