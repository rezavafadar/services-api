import bcrypt from 'bcrypt';

const hash = (data: string) => bcrypt.hash(data, 10);

const compare = (data: string, encrypted: string) =>
	bcrypt.compare(data, encrypted);

export default {
	hash,
	compare,
};
