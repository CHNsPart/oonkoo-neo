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
      return NextResponse.json(
        { error: "Unauthorized", isAuthenticated: false }, 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email },
    });

    const serializedUser = serializeUser(user);

    return NextResponse.json({
      user: serializedUser ? {
        ...serializedUser,
        isAdmin: serializedUser.isAdmin || kindeUser.email === ADMIN_EMAIL
      } : null,
      isAuthenticated: true
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error", isAuthenticated: false },
      { status: 500 }
    );
  }
}