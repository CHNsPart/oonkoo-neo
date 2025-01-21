// app/api/auth/[kindeAuth]/route.ts
import { handleAuth, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/* eslint-disable  @typescript-eslint/no-explicit-any */
async function syncUser(user: any) {
  if (!user?.email) return;

  try {
    console.log('Attempting to sync user:', user.email);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          firstName: user.given_name ?? null,
          lastName: user.family_name ?? null,
          profileImage: user.picture ?? null,
          isAdmin: user.email === "imchn24@gmail.com",
          lastLoginAt: new Date(),
        },
      });
      console.log('Created new user:', newUser);
    } else {
      const updatedUser = await prisma.user.update({
        where: { email: user.email },
        data: {
          firstName: user.given_name ?? existingUser.firstName,
          lastName: user.family_name ?? existingUser.lastName,
          profileImage: user.picture ?? existingUser.profileImage,
          lastLoginAt: new Date(),
        },
      });
      console.log('Updated existing user:', updatedUser);
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
}

type Props = {
  params: Promise<{ kindeAuth: string }>
}

export async function GET(
  request: NextRequest,
  context: Props
): Promise<Response> {
  try {
    const params = await context.params;
    const result = await handleAuth(request, params.kindeAuth);
    
    // Ensure we're always returning a Response object
    if (result instanceof Response) {
      if (result.status === 302) {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        
        if (user) {
          console.log('Syncing user after authentication:', user.email);
          await syncUser(user);
        }
      }
      return result;
    }
    
    // If result is a function (legacy handler), convert it to a Response
    if (typeof result === 'function') {
      return new Response('OK', { status: 200 });
    }
    
    // Handle any other cases by returning a generic response
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Auth handler error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}