// app/api/project-inquiries/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Updated Validation schema
const projectInquirySchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email(),
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
  ]),
  type: z.string().default("website"),
  meetingTime: z.string(),
  origin: z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = projectInquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const inquiry = await prisma.projectInquiry.create({
      data: {
        name: body.name,
        company: body.company,
        email: body.email,
        phone: body.phone,
        budget: body.budget,
        description: body.description,
        project: body.project,
        type: body.type,
        origin: body.origin,
        meetingTime: body.meetingTime ? new Date(body.meetingTime) : null,
      },
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating project inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const status = searchParams.get("status");
    const project = searchParams.get("project");
    const type = searchParams.get("type");

    const where = {
      ...(status && { status }),
      ...(project && { project }),
      ...(type && { type }),
    };

    const inquiries = await prisma.projectInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Error getting project inquiries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}