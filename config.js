import getConfig from "next/config"; // accessing next.config variables

const { publicRuntimeConfig } = getConfig();

// checking for production or dev mode
export const API = publicRuntimeConfig.PRODUCTION
? "https://artificeon.vercel.app"
: "http://localhost:3000";

export const CLIENT = publicRuntimeConfig.PRODUCTION
  ? "https://artificeon.vercel.app"
  : "http://localhost:3000";

export const APP_NAME = publicRuntimeConfig.APP_NAME;
