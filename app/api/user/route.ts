// app/api/user/route.ts
import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "imchn24@gmail.com";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    console.log('Kinde user:', kindeUser);

    if (!kindeUser?.email) {
      return NextResponse.json(
        { user: null, isAuthenticated: false }, 
        { status: 401 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: kindeUser.email },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: kindeUser.email,
          firstName: kindeUser.given_name ?? null,
          lastName: kindeUser.family_name ?? null,
          profileImage: kindeUser.picture ?? null,
          isAdmin: kindeUser.email === ADMIN_EMAIL,
          lastLoginAt: new Date(),
        },
      });
      console.log('Created new user during GET:', user);
    }

    console.log('Database user:', user);

    return NextResponse.json({
      user: {
        ...user,
        isAdmin: user.isAdmin || kindeUser.email === ADMIN_EMAIL
      },
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}