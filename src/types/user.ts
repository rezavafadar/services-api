import { Request } from 'express';
import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
	username: string;
	email: string;
	photo: string;
	credit: number;
	password: string;
	role: string;
	active: string;
	createAt: Date;
	updateAt: Date;
	isEmailVerify: boolean;
	illegalEmail: string;
}

export interface UserInRequest extends Request {
	user: UserDocument;
}

export interface CreateUser {
	username: string;
	email: string;
	password: string;
	illegalEmail: string;
	photo?: string;
	credit?: number;
	role?: string;
	active?: string;
	createAt?: Date;
	updateAt?: Date;
	isEmailVerify?: boolean;
}
