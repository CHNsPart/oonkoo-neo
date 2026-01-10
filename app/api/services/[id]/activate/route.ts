import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { serviceActivationSchema } from "@/lib/validations/service";
import { getEffectivePermissions, hasPermission } from "@/lib/permissions";
import { Role, Permission } from "@/types/permissions";
import { calculateEndDate } from "@/lib/billing-utils";

// POST - Activate a service (admin only)
export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin permissions
    const admin = await prisma.user.findUnique({
      where: { email: kindeUser.email },
      select: { role: true, permissions: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const effectivePermissions = getEffectivePermissions(
      admin.role as Role,
      admin.permissions as Permission[]
    );

    if (!hasPermission(effectivePermissions, "MANAGE_SERVICES")) {
      return NextResponse.json(
        { error: "Forbidden - Requires MANAGE_SERVICES permission" },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await req.json();
    const result = serviceActivationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    // Check if service exists and is pending
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
      select: { id: true, status: true, serviceId: true, userEmail: true, billingInterval: true },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    if (existingService.status !== "pending") {
      return NextResponse.json(
        { error: `Service is already ${existingService.status}. Only pending services can be activated.` },
        { status: 400 }
      );
    }

    // Activate the service
    const now = new Date();
    const billingInterval = existingService.billingInterval as "monthly" | "annually";
    const endDate = calculateEndDate(now, billingInterval);

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        status: "active",
        activatedAt: now,
        paymentReceivedAt: now,
        endDate: endDate,
        adminNotes: result.data.adminNotes || null,
      },
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

    return NextResponse.json({
      service,
      message: "Service activated successfully",
    });
  } catch (error) {
    console.error("Error activating service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
