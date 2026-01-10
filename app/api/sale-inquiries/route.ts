// app/api/sale-inquiries/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withAuthorization } from "@/lib/permissions";

// Validation schema
const saleInquirySchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  description: z.string().optional(),
  meetingTime: z.string().optional().nullable(),
  saleId: z.string(),
  type: z.string(),
  originalPrice: z.number(),
  salePrice: z.number(),
});

// POST is public - allows website visitors to submit sale inquiries
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const result = saleInquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const inquiry = await prisma.saleInquiry.create({
      data: {
        ...body,
        meetingTime: body.meetingTime ? new Date(body.meetingTime) : null,
      },
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating sale inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET requires MANAGE_INQUIRIES permission
export async function GET(req: Request) {
  return withAuthorization<{ inquiries: unknown[] } | { error: string }>("MANAGE_INQUIRIES", async () => {
    try {
      const searchParams = new URL(req.url).searchParams;
      const status = searchParams.get("status");
      const type = searchParams.get("type");
      const saleId = searchParams.get("saleId");

      const where = {
        ...(status && { status }),
        ...(type && { type }),
        ...(saleId && { saleId }),
      };

      const inquiries = await prisma.saleInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ inquiries });
    } catch (error) {
      console.error("Error getting sale inquiries:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  });
}
