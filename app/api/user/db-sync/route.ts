import { prisma } from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { serializeUser } from "@/lib/utils";
import {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  SUPER_ADMIN_EMAIL,
} from "@/types/permissions";

/**
 * Get effective permissions by merging role defaults with custom permissions
 */
function getEffectivePermissions(
  role: Role,
  customPermissions?: Permission[] | null
): Permission[] {
  const rolePermissions = [...ROLE_PERMISSIONS[role]];
  if (!customPermissions || customPermissions.length === 0) {
    return rolePermissions;
  }
  const merged = new Set([...rolePermissions, ...customPermissions]);
  return Array.from(merged) as Permission[];
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSuperAdminUser = kindeUser.email === SUPER_ADMIN_EMAIL;

    const user = await prisma.user.upsert({
      where: { email: kindeUser.email },
      update: {
        firstName: kindeUser.given_name ?? null,
        lastName: kindeUser.family_name ?? null,
        profileImage: kindeUser.picture ?? null,
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

    const serializedUser = serializeUser(user);

    const effectivePermissions = getEffectivePermissions(
      user.role as Role,
      user.permissions as Permission[]
    );

    return NextResponse.json({
      user: serializedUser
        ? {
            ...serializedUser,
            permissions: effectivePermissions,
            isAdmin:
              user.role === "SUPER_ADMIN" ||
              user.role === "ADMIN" ||
              isSuperAdminUser,
          }
        : null,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
