// app/dashboard/_components/layout-server.tsx
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
// import { User } from "@/types/user";

// const ADMIN_EMAIL = "imchn24@gmail.com";

// components/dashboard/server-layouts/layout-server.tsx
export async function getDashboardLayout() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.email) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: kindeUser.email }
  });

  return { initialUser: user };
}