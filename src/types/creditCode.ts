import mongoose from 'mongoose';

export interface CreditCodeDocument extends mongoose.Document {
	code: string;
	amount: number;
	users: string[];
	status: boolean;
	expiresTime: Date;
}

export interface CreateCode {
	code: string;
	amount: number;
	status?: boolean;
	expiresTime?: Date;
}
