import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    
    if (!kindeUser?.email) return null;

    const user = await prisma.user.upsert({
      where: { email: kindeUser.email },
      update: {
        lastLoginAt: new Date(),
      },
      create: {
        email: kindeUser.email,
        firstName: kindeUser.given_name ?? null,
        lastName: kindeUser.family_name ?? null,
        profileImage: kindeUser.picture ?? null,
        isAdmin: kindeUser.email === "imchn24@gmail.com",
        lastLoginAt: new Date(),
      },
    });

    return {
      ...kindeUser,
      ...user,
      isAdmin: user.isAdmin || kindeUser.email === "imchn24@gmail.com"
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}