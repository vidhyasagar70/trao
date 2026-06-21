import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env';
import { JwtPayload } from '../types';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export const generateToken = (id: string): string => {
  return jwt.sign({ id } satisfies JwtPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const sendTokenCookie = (res: Response, token: string): void => {
  const isProduction = env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,           // Must be true when sameSite is 'none'
    sameSite: isProduction ? 'none' : 'lax', // 'none' allows cross-origin (Render ↔ Vercel)
    maxAge: COOKIE_MAX_AGE,
  });
};

export const clearTokenCookie = (res: Response): void => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
