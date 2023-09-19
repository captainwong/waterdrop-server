import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

export const hash = async (password: string) => {
  return bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
};

export const compare = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
