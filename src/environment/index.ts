import * as dotenv from "dotenv";

dotenv.config();

const isProd = import.meta.env.PROD;

const isDev = import.meta.env.DEV;

const isSSR = import.meta.env.SSR;

const port = isProd ? process.env.PORT : import.meta.env.VITE_PORT;

const host = isProd ? process.env.HOST : import.meta.env.VITE_HOST;

const apiPrefix = import.meta.env.VITE_API_PREFIX;

export const appEnv = {
  isProd,
  isDev,
  isSSR,
  port,
  host,
  apiPrefix,
}