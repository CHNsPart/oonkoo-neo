import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { serializeUser } from "@/lib/utils";

const ADMIN_EMAIL = "imchn24@gmail.com";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email: kindeUser.email },
      update: {
        firstName: kindeUser.given_name ?? null,
        lastName: kindeUser.family_name ?? null,
        profileImage: kindeUser.picture ?? null,
        lastLoginAt: new Date(),
        isAdmin: kindeUser.email === ADMIN_EMAIL
      },
      create: {
        email: kindeUser.email,
        firstName: kindeUser.given_name ?? null,
        lastName: kindeUser.family_name ?? null,
        profileImage: kindeUser.picture ?? null,
        isAdmin: kindeUser.email === ADMIN_EMAIL,
        lastLoginAt: new Date(),
      },
    });

    const serializedUser = serializeUser(user);

    return NextResponse.json({ 
      user: serializedUser ? {
        ...serializedUser,
        isAdmin: serializedUser.isAdmin || kindeUser.email === ADMIN_EMAIL
      } : null
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}