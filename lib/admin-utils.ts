import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export const isAdmin = (user: KindeUser | null): boolean => {
  return user?.email === "imchn24@gmail.com";
};