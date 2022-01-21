import multer, { FileFilterCallback, DiskStorageOptions, Multer } from 'multer';
import { UserInRequest } from '../middlewares/protect';
import AppError from '../utils/appError';

// Multer

const imgStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/user/profileImgs');
	},
	filename: (req: UserInRequest, file, cb) => {
		const ext = file.mimetype.split('/')[1];
		cb(null, `${req.user.id}.${ext}`);
	},
});

const imgFilter = (req: UserInRequest, file: any, cb: any) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('BadRequest!', 400, ['File is not Image !']));
	}
};

export const uploadImg = multer({
	storage: imgStorage,
	fileFilter: imgFilter,
});

// Sharp

// const imgResize =
