// app/api/project-inquiries/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateProjectInquirySchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  budget: z.number().optional(),
  description: z.string().optional(),
  project: z.enum([
    'website',
    'software',
    'mobile_app',
    'ui_design',
    'ai_solutions',
    'backend',
    'branding'
  ]).optional(),
  type: z.string().optional(),  // Added type field
  status: z.enum([
    'new',
    'in_discussion',
    'quoted',
    'accepted',
    'rejected'
  ]).optional(),
  meetingTime: z.string().datetime().optional(),
});

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const inquiry = await prisma.projectInquiry.findUnique({
      where: { id: params.id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Project inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Error getting project inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    
    // Validate request body
    const result = updateProjectInquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const inquiry = await prisma.projectInquiry.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Error updating project inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await prisma.projectInquiry.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Project inquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}