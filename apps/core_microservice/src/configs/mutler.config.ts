import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
      callback(null, fileName);
    },
  }),
};

export const fileFilter = (
  _req,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^(image|video)\/.+$/)) {
    return callback(new Error('Only image files are allowed'), false);
  }
  callback(null, true);
};
