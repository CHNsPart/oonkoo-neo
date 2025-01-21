// app/api/sale-inquiries/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSaleInquirySchema = z.object({
  name: z.string().min(2).optional(),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  meetingTime: z.string().optional().nullable(),
  status: z.enum(['new', 'contacted', 'accepted', 'rejected']).optional(),
});

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const inquiry = await prisma.saleInquiry.findUnique({
      where: { id: params.id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Sale inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Error getting sale inquiry:", error);
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
    const result = updateSaleInquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const inquiry = await prisma.saleInquiry.update({
      where: { id: params.id },
      data: {
        ...body,
        meetingTime: body.meetingTime ? new Date(body.meetingTime) : undefined,
      },
    });

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Error updating sale inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await prisma.saleInquiry.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Sale inquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sale inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}