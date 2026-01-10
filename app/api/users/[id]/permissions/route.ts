// app/api/users/[id]/permissions/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withSuperAdminAuthorization } from "@/lib/permissions";
import {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  Role,
  Permission,
} from "@/types/permissions";

// Validation schema for updating permissions
const updatePermissionsSchema = z.object({
  role: z
    .enum(ROLES as unknown as [string, ...string[]])
    .optional()
    .refine((val) => val !== "SUPER_ADMIN", {
      message: "Cannot assign SUPER_ADMIN role",
    }),
  permissions: z
    .array(z.enum(PERMISSIONS as unknown as [string, ...string[]]))
    .optional(),
});

// GET - Get a user's role and permissions
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withSuperAdminAuthorization<{ user: unknown } | { error: string }>(async () => {
    try {
      const { id } = await params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          permissions: true,
          isAdmin: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Get effective permissions (role defaults + custom)
      const rolePermissions = ROLE_PERMISSIONS[user.role as Role] || [];
      const effectivePermissions = [
        ...new Set([...rolePermissions, ...(user.permissions as Permission[])]),
      ];

      return NextResponse.json({
        user: {
          ...user,
          effectivePermissions,
          rolePermissions,
        },
      });
    } catch (error) {
      console.error("Error getting user permissions:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  });
}

// PATCH - Update a user's role and/or permissions (SUPER_ADMIN only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withSuperAdminAuthorization<{ user: unknown; message?: string } | { error: string; details?: unknown }>(async (currentUser) => {
    try {
      const { id } = await params;

      // Prevent modifying own permissions
      if (currentUser.id === id) {
        return NextResponse.json(
          { error: "Cannot modify your own permissions" },
          { status: 400 }
        );
      }

      const body = await req.json();
      const result = updatePermissionsSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.issues },
          { status: 400 }
        );
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      });

      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Prevent modifying SUPER_ADMIN users
      if (existingUser.role === "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Cannot modify Super Admin permissions" },
          { status: 403 }
        );
      }

      const updateData: {
        role?: Role;
        permissions?: Permission[];
        isAdmin?: boolean;
      } = {};

      if (result.data.role) {
        updateData.role = result.data.role as Role;
        // Update legacy isAdmin field based on new role
        updateData.isAdmin =
          result.data.role === "ADMIN" || result.data.role === "SUPER_ADMIN";
      }

      if (result.data.permissions) {
        // Filter out MANAGE_USERS permission - only SUPER_ADMIN should have it
        const filteredPermissions = result.data.permissions.filter(
          (p) => p !== "MANAGE_USERS"
        ) as Permission[];
        updateData.permissions = filteredPermissions;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          permissions: true,
          isAdmin: true,
        },
      });

      // Get effective permissions for response
      const rolePermissions =
        ROLE_PERMISSIONS[updatedUser.role as Role] || [];
      const effectivePermissions = [
        ...new Set([
          ...rolePermissions,
          ...(updatedUser.permissions as Permission[]),
        ]),
      ];

      return NextResponse.json({
        user: {
          ...updatedUser,
          effectivePermissions,
          rolePermissions,
        },
        message: "Permissions updated successfully",
      });
    } catch (error) {
      console.error("Error updating user permissions:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  });
}
