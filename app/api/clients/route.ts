// app/api/clients/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withAuthorization } from "@/lib/permissions";

// Validation schema for creating/updating users
const createUserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["VIEWER", "CLIENT", "MANAGER", "ADMIN"]).optional(),
});

// GET all clients - requires MANAGE_CLIENTS permission
export async function GET() {
  return withAuthorization<{ clients: unknown[] } | { error: string }>("MANAGE_CLIENTS", async () => {
    try {
      const clients = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
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

      return NextResponse.json({ clients });
    } catch (error) {
      console.error("Error fetching clients:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  });
}

// POST - create new client - requires MANAGE_CLIENTS permission
export async function POST(req: Request) {
  return withAuthorization<{ client: unknown } | { error: string; details?: unknown }>("MANAGE_CLIENTS", async () => {
    try {
      const body = await req.json();
      const result = createUserSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.issues },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: result.data.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      const client = await prisma.user.create({
        data: {
          email: result.data.email,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          role: result.data.role || "VIEWER",
          permissions: ["VIEW_OWN_DATA"],
        },
      });

      return NextResponse.json({ client }, { status: 201 });
    } catch (error) {
      console.error("Error creating client:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  });
}