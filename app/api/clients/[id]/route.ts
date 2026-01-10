// app/api/clients/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getAuthenticatedUser,
  hasPermission,
  isSuperAdmin,
} from "@/lib/permissions";
import { SUPER_ADMIN_EMAIL } from "@/types/permissions";

const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  role: z.enum(["VIEWER", "CLIENT", "MANAGER", "ADMIN"]).optional(),
});

// GET single client - requires MANAGE_CLIENTS permission
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = params.id;

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.permissions, "MANAGE_CLIENTS")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        role: true,
        permissions: true,
        isAdmin: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error getting client:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH - update client - requires MANAGE_CLIENTS permission
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = params.id;

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.permissions, "MANAGE_CLIENTS")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    // Check if target is the super admin (cannot modify super admin)
    const targetClient = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });

    if (targetClient?.email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Cannot modify Super Admin account" },
        { status: 403 }
      );
    }

    // Only SUPER_ADMIN can change roles
    const updateData: Record<string, unknown> = {};
    if (result.data.firstName) updateData.firstName = result.data.firstName;
    if (result.data.lastName) updateData.lastName = result.data.lastName;

    // Role changes require SUPER_ADMIN
    if (result.data.role && isSuperAdmin(user.email)) {
      updateData.role = result.data.role;
    }

    const client = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - delete client - requires MANAGE_CLIENTS permission
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = params.id;

    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.permissions, "MANAGE_CLIENTS")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if trying to delete super admin
    const targetClient = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });

    if (targetClient?.email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Cannot delete Super Admin account" },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
