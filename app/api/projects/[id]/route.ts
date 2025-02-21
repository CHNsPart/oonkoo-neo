// app/api/projects/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { canModifyProject } from "@/lib/project-utils";

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

    const hasAccess = await canModifyProject(kindeUser.email, params.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Parse features before sending
    const parsedProject = {
      ...project,
      features: project.features ? JSON.parse(project.features) : {}
    };

    return NextResponse.json({ project: parsedProject });
  } catch (error) {
    console.error("Error getting project:", error);
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

    // Check if admin can reassign user
    const currentUser = await prisma.user.findUnique({
      where: { email: kindeUser.email }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const hasAccess = await canModifyProject(kindeUser.email, params.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // If admin is reassigning to another user
    let targetUserId = undefined;
    if (currentUser.isAdmin && body.userEmail && body.userEmail !== kindeUser.email) {
      const targetUser = await prisma.user.findUnique({
        where: { email: body.userEmail }
      });
      
      if (!targetUser) {
        return NextResponse.json(
          { error: "Target user not found" },
          { status: 404 }
        );
      }
      
      targetUserId = targetUser.id;
    }

    // Ensure features is stringified before saving
    const updateData = {
      ...body,
      features: typeof body.features === 'string' 
        ? body.features 
        : JSON.stringify(body.features),
      meetingTime: body.meetingTime ? new Date(body.meetingTime) : null,
      ...(targetUserId && { userId: targetUserId }),
    };

    const project = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
    });

    // Parse features for response
    const updatedProject = {
      ...project,
      features: typeof project.features === 'string' 
        ? JSON.parse(project.features) 
        : project.features
    };

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : 'Unknown error' },
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

    const hasAccess = await canModifyProject(kindeUser.email, params.id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Forbidden" },
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