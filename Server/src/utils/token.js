import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (payload, options = {}) => {
  if (!env.jwtSecret) {
    throw new Error('JWT secret is missing');
  }

  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d', ...options });
};

export const verifyToken = (token) => {
  if (!env.jwtSecret) {
    throw new Error('JWT secret is missing');
  }

  return jwt.verify(token, env.jwtSecret);
};
