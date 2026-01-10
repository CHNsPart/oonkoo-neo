import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { canModifyService } from "@/lib/service-utils";
import {
  adminServiceSchema,
  userServiceSchema,
} from "@/lib/validations/service";
import { getEffectivePermissions, hasPermission } from "@/lib/permissions";
import { Role, Permission } from "@/types/permissions";
import {
  calculateBillingPeriod,
  getDaysSinceRequest,
  calculateEndDate,
} from "@/lib/billing-utils";

export async function GET(
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

    const hasAccess = await canModifyService(kindeUser.email, params.id);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id },
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

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Calculate billing period and days since request
    const billingInterval = service.billingInterval as "monthly" | "annually";
    const billingPeriod = service.status === "active" && service.activatedAt
      ? calculateBillingPeriod(service.activatedAt, billingInterval)
      : null;

    const daysSinceRequest = service.status === "pending"
      ? getDaysSinceRequest(service.createdAt)
      : null;

    return NextResponse.json({
      service: {
        ...service,
        billingPeriod,
        daysSinceRequest,
      },
    });
  } catch (error) {
    console.error("Error getting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const canModify = await canModifyService(kindeUser.email, params.id);
    if (!canModify) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email },
      select: { role: true, permissions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get existing service to maintain serviceId
    const existingService = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const effectivePermissions = getEffectivePermissions(
      user.role as Role,
      user.permissions as Permission[]
    );

    const canManageServices = hasPermission(
      effectivePermissions,
      "MANAGE_SERVICES"
    );

    if (canManageServices) {
      // Debug: Log what's being received
      console.log("=== PATCH Service Debug ===");
      console.log("Body received:", JSON.stringify(body, null, 2));
      console.log("externalLinks in body:", body.externalLinks);

      const result = adminServiceSchema.safeParse(body);
      if (!result.success) {
        console.log("Validation failed:", result.error.errors);
        return NextResponse.json(
          { error: "Invalid input", details: result.error.errors },
          { status: 400 }
        );
      }

      console.log("Validated data:", JSON.stringify(result.data, null, 2));
      console.log("externalLinks after validation:", result.data.externalLinks);

      // Prepare data with proper type conversions
      const updateData: Record<string, unknown> = {
        serviceId: result.data.serviceId,
        billingInterval: result.data.billingInterval,
        status: result.data.status,
        userEmail: result.data.userEmail,
        userNotes: result.data.userNotes ?? null,
        adminNotes: result.data.adminNotes ?? null,
        meetingTime: result.data.meetingTime ? new Date(result.data.meetingTime) : null,
        // Explicitly handle externalLinks - store as JSON
        externalLinks: result.data.externalLinks ?? [],
      };

      // Convert date strings to Date objects
      if (result.data.activatedAt) {
        updateData.activatedAt = new Date(result.data.activatedAt);
      } else {
        updateData.activatedAt = null;
      }

      if (result.data.paymentReceivedAt) {
        updateData.paymentReceivedAt = new Date(result.data.paymentReceivedAt);
      } else {
        updateData.paymentReceivedAt = null;
      }

      // Auto-calculate endDate based on activatedAt + billingInterval
      const billingInterval = (result.data.billingInterval || existingService.billingInterval) as "monthly" | "annually";
      const activatedAt = result.data.activatedAt
        ? new Date(result.data.activatedAt)
        : existingService.activatedAt;

      if (activatedAt) {
        updateData.endDate = calculateEndDate(activatedAt, billingInterval);
      }

      console.log("Update data being sent to Prisma:", JSON.stringify(updateData, null, 2));

      const service = await prisma.service.update({
        where: { id: params.id },
        data: updateData,
      });

      console.log("Service saved, externalLinks:", service.externalLinks);

      return NextResponse.json({ service });
    } else {
      // For regular users, only validate status and billingInterval
      const result = userServiceSchema.safeParse({
        ...body,
        serviceId: existingService.serviceId,
        status: body.status,
        billingInterval: body.billingInterval,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.errors },
          { status: 400 }
        );
      }

      const service = await prisma.service.update({
        where: { id: params.id },
        data: {
          status: body.status,
          billingInterval: body.billingInterval,
          // Maintain existing serviceId
          serviceId: existingService.serviceId,
        },
      });

      return NextResponse.json({ service });
    }
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email },
      select: { role: true, permissions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const effectivePermissions = getEffectivePermissions(
      user.role as Role,
      user.permissions as Permission[]
    );

    // Only users with MANAGE_SERVICES can delete
    if (!hasPermission(effectivePermissions, "MANAGE_SERVICES")) {
      return NextResponse.json(
        { error: "Forbidden - Requires MANAGE_SERVICES permission" },
        { status: 403 }
      );
    }

    await prisma.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
