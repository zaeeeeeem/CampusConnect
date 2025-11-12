import multer from 'multer';
import path from 'path';
import { env } from '../config/env.js';
import { ensureDir } from '../utils/files.js';

ensureDir(env.imageBasePath);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.imageBasePath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${baseName}-${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });
