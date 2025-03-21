import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`, // Nombre único para cada archivo
      bucketName: 'uploads', // Nombre del bucket en GridFS
    };
  },
});

const upload = multer({ storage });

export default upload;