// app/api/projects/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { projectSchema } from "@/lib/validations/project";

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

    // Check if admin is creating for another user
    let targetUser = user;
    if (user?.isAdmin && body.userEmail && body.userEmail !== kindeUser.email) {
      targetUser = await prisma.user.findUnique({
        where: { email: body.userEmail }
      });
      
      if (!targetUser) {
        return NextResponse.json(
          { error: "Target user not found" },
          { status: 404 }
        );
      }
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
        meetingTime: result.data.meetingTime ? new Date(result.data.meetingTime) : null,
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
      ? {} // Admins see all projects
      : { userId: user?.id }; // Users see only their projects

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Parse features for each project
    const parsedProjects = projects.map(project => ({
      ...project,
      features: project.features ? JSON.parse(project.features) : {}
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

    // For delete, we only allow admins
    const user = await prisma.user.findUnique({
      where: { email: kindeUser.email }
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin only action" },
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