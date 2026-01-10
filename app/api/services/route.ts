import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  adminServiceSchema,
  initialServiceSchema,
  userServiceSchema,
} from "@/lib/validations/service";
import { getEffectivePermissions, hasPermission } from "@/lib/permissions";
import { Role, Permission } from "@/types/permissions";
import {
  calculateBillingPeriod,
  getDaysSinceRequest,
} from "@/lib/billing-utils";

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email },
      select: { id: true, email: true, role: true, permissions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const effectivePermissions = getEffectivePermissions(
      user.role as Role,
      user.permissions as Permission[]
    );

    const canManageServices = hasPermission(
      effectivePermissions,
      "MANAGE_SERVICES"
    );

    // Check if this is a request from the pricing page
    const isInitialCreation = body.status === "pending" && !body.userEmail;

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

    // Different validation based on permissions
    if (canManageServices) {
      const result = adminServiceSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.errors },
          { status: 400 }
        );
      }

      // For users with MANAGE_SERVICES, create service for specified user
      const targetUser = await prisma.user.findUnique({
        where: { email: body.userEmail },
        select: { id: true, email: true },
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
          status: "pending", // Force pending status for new services
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

export async function GET(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email },
      select: { id: true, role: true, permissions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const effectivePermissions = getEffectivePermissions(
      user.role as Role,
      user.permissions as Permission[]
    );

    const canManageServices = hasPermission(
      effectivePermissions,
      "MANAGE_SERVICES"
    );

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    // Build where clause based on permissions and filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = canManageServices
      ? {} // Can see all services
      : { userId: user.id }; // Can only see own services

    // Add status filter if provided
    if (statusFilter && ["pending", "active", "paused", "cancelled"].includes(statusFilter)) {
      where.status = statusFilter;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    // Calculate billing period and days since request for each service
    const servicesWithBilling = services.map((service) => {
      const billingInterval = service.billingInterval as "monthly" | "annually";
      const billingPeriod = service.status === "active" && service.activatedAt
        ? calculateBillingPeriod(service.activatedAt, billingInterval)
        : null;

      const daysSinceRequest = service.status === "pending"
        ? getDaysSinceRequest(service.createdAt)
        : null;

      return {
        ...service,
        billingPeriod,
        daysSinceRequest,
      };
    });

    return NextResponse.json({ services: servicesWithBilling });
  } catch (error) {
    console.error("Error getting services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
