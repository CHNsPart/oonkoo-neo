// app/api/projects/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { projectSchema } from "@/lib/validations/project";
import { getEffectivePermissions, hasPermission } from "@/lib/permissions";
import { Role, Permission } from "@/types/permissions";

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

    // Check if user with MANAGE_PROJECTS is creating for another user
    let targetUser = user;
    if (
      hasPermission(effectivePermissions, "MANAGE_PROJECTS") &&
      body.userEmail &&
      body.userEmail !== kindeUser.email
    ) {
      const foundUser = await prisma.user.findUnique({
        where: { email: body.userEmail },
        select: { id: true, email: true },
      });

      if (!foundUser) {
        return NextResponse.json(
          { error: "Target user not found" },
          { status: 404 }
        );
      }
      targetUser = { ...targetUser, ...foundUser };
    }

    // Parse and validate the request body
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    // Store features as proper JSON string
    const project = await prisma.project.create({
      data: {
        ...result.data,
        meetingTime: result.data.meetingTime
          ? new Date(result.data.meetingTime)
          : null,
        features: JSON.stringify(result.data.features),
        userId: targetUser?.id || null,
        isRegistered: !!targetUser,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
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

    // Define filter based on permissions
    // Users with MANAGE_PROJECTS can see all, others see only their own
    const where = hasPermission(effectivePermissions, "MANAGE_PROJECTS")
      ? {} // Can see all projects
      : { userId: user.id }; // Can only see own projects

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Parse features for each project
    const parsedProjects = projects.map((project) => ({
      ...project,
      features: project.features ? JSON.parse(project.features) : {},
    }));

    return NextResponse.json({ projects: parsedProjects });
  } catch (error) {
    console.error("Error getting projects:", error);
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

    // Only users with MANAGE_PROJECTS can delete
    if (!hasPermission(effectivePermissions, "MANAGE_PROJECTS")) {
      return NextResponse.json(
        { error: "Forbidden - Requires MANAGE_PROJECTS permission" },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
