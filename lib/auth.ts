import { getBaseUrl } from "./utils";

export const authConfig = {
  baseURL: getBaseUrl(),
  redirects: {
    login: "/auth",
    home: "/dashboard",
  },
};