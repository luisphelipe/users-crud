// HOST
const isServer = typeof window === 'undefined';
export const HOST = isServer ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL;

// AUTH
export const AUTH_LOGIN = `${HOST}/auth/login`;
export const AUTH_SIGNUP = `${HOST}/auth/signup`;
export const AUTH_FORGOT_PASSWORD = `${HOST}/auth/forgot-password`;
export const AUTH_RESET_PASSWORD = `${HOST}/auth/reset-password`;

// USERS
export const USERS = `${HOST}/users`;
