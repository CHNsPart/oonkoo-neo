import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { adminServiceSchema, initialServiceSchema, userServiceSchema } from "@/lib/validations/service";

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if this is a request from the pricing page
    const isInitialCreation = body.status === 'pending' && !body.userEmail;

    if (isInitialCreation) {
      const result = initialServiceSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.errors },
          { status: 400 }
        );
      }

      const service = await prisma.service.create({
        data: {
          ...result.data,
          userId: user.id,
          userEmail: user.email,
        },
      });

      return NextResponse.json({ service }, { status: 201 });
    }

    // Different validation based on user role
    if (user.isAdmin) {
      const result = adminServiceSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.errors },
          { status: 400 }
        );
      }

      // For admin, create service for specified user
      const targetUser = await prisma.user.findUnique({
        where: { email: body.userEmail }
      });

      if (!targetUser) {
        return NextResponse.json(
          { error: "Target user not found" },
          { status: 404 }
        );
      }

      const service = await prisma.service.create({
        data: {
          ...result.data,
          userId: targetUser.id,
          userEmail: targetUser.email,
        },
      });

      return NextResponse.json({ service }, { status: 201 });
    } else {
      // For regular users
      const result = userServiceSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.errors },
          { status: 400 }
        );
      }

      const service = await prisma.service.create({
        data: {
          ...result.data,
          userId: user.id,
          userEmail: user.email,
          status: 'pending', // Force pending status for new services
        },
      });

      return NextResponse.json({ service }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email }
    });

    // Define filter based on user role
    const where = user?.isAdmin
    ? {} // Admins see all services
    : { userId: user?.id }; // Users see only their services

    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error getting services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}