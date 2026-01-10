// app/api/leads/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withAuthorization } from "@/lib/permissions";

// Validation schema
const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  status: z.enum(["new", "contacted", "qualified", "converted"]).default("new"),
  source: z.enum(["website", "referral", "social"]).default("website"),
});

export async function POST(req: Request) {
  return withAuthorization<{ lead: unknown } | { error: string; details?: unknown }>("MANAGE_LEADS", async () => {
    try {
      const body = await req.json();

      // Validate request body
      const result = leadSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          { error: "Invalid input", details: result.error.issues },
          { status: 400 }
        );
      }

      const lead = await prisma.lead.create({
        data: {
          name: body.name,
          email: body.email,
          status: body.status,
          source: body.source,
        },
      });

      return NextResponse.json({ lead }, { status: 201 });
    } catch (error) {
      console.error("Error creating lead:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  });
}

export async function GET(req: Request) {
  return withAuthorization<{ leads: unknown[] } | { error: string }>("MANAGE_LEADS", async () => {
    try {
      const searchParams = new URL(req.url).searchParams;
      const status = searchParams.get("status");
      const source = searchParams.get("source");

      // Build where clause based on query params
      const where = {
        ...(status && { status }),
        ...(source && { source }),
      };

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ leads });
    } catch (error) {
      console.error("Error getting leads:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  });
}
