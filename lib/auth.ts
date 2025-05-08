import { getBaseUrl } from "./utils";

export const authConfig = {
  baseURL: getBaseUrl(),
  redirects: {
    login: "/client-portal",
    home: "/dashboard",
  },
};