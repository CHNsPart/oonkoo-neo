import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { canModifyService } from "@/lib/service-utils";
import { adminServiceSchema, userServiceSchema } from "@/lib/validations/service";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasAccess = await canModifyService(kindeUser.email, params.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error getting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const canModify = await canModifyService(kindeUser.email, params.id);
    if (!canModify) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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

    // Get existing service to maintain serviceId
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    if (user.isAdmin) {
      const result = adminServiceSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.errors },
          { status: 400 }
        );
      }

      const service = await prisma.service.update({
        where: { id: params.id },
        data: result.data,
      });

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

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can delete services
    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin only action" },
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