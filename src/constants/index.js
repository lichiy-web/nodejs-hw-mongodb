import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 20;

export const PWD_HASH_SALT = 10;
export const TOKEN_LENGTH = 30;

export const ONE_MINUTE = 60 * 1000;
export const ONE_DAY = 24 * 60 * ONE_MINUTE;

export const ACCES_TOKEN_SHELF_LIFE = 15 * ONE_MINUTE;
export const REFRESH_TOKEN_SHELF_LIFE = 30 * ONE_DAY;

export const SMTP = {
  HOST: 'SMTP_HOST',
  PORT: 'SMTP_PORT',
  USER: 'SMTP_USER',
  PASSWORD: 'SMTP_PASSWORD',
  FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.resolve('src', 'templates');
