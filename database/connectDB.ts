import mongoose from 'mongoose';

const connect = async (uri: string): Promise<any> => {
	try {
		await mongoose.connect(uri);
		console.log('Connected to the database..');
	} catch (err) {
		console.log('Cannot connect to database..');
		console.error(err);
		process.exit(1);
	}
};

export default connect;
