import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  SUPER_ADMIN_EMAIL,
} from "@/types/permissions";
import { getEffectivePermissions } from "./permissions";

export async function getCurrentUser() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) return null;

    const isSuperAdminUser = kindeUser.email === SUPER_ADMIN_EMAIL;

    const user = await prisma.user.upsert({
      where: { email: kindeUser.email },
      update: {
        lastLoginAt: new Date(),
        // Ensure super admin always has correct role
        ...(isSuperAdminUser
          ? {
              role: "SUPER_ADMIN",
              permissions: [...ROLE_PERMISSIONS.SUPER_ADMIN],
              isAdmin: true,
            }
          : {}),
      },
      create: {
        email: kindeUser.email,
        firstName: kindeUser.given_name ?? null,
        lastName: kindeUser.family_name ?? null,
        profileImage: kindeUser.picture ?? null,
        role: isSuperAdminUser ? "SUPER_ADMIN" : "VIEWER",
        permissions: isSuperAdminUser
          ? [...ROLE_PERMISSIONS.SUPER_ADMIN]
          : [...ROLE_PERMISSIONS.VIEWER],
        isAdmin: isSuperAdminUser,
        lastLoginAt: new Date(),
      },
    });

    const effectivePermissions = getEffectivePermissions(
      user.role as Role,
      user.permissions as Permission[]
    );

    return {
      ...kindeUser,
      ...user,
      role: user.role as Role,
      permissions: effectivePermissions,
      // Backward compatibility: isAdmin is true for SUPER_ADMIN and ADMIN roles
      isAdmin:
        user.role === "SUPER_ADMIN" ||
        user.role === "ADMIN" ||
        isSuperAdminUser,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
