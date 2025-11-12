import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

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
