import authoptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authoptions);
  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }
  const body = await request.json();
  //   const validation = issueSchema.safeParse(body);

  //   if (!validation.success) {
  //     return NextResponse.json(validation.error.format(), { status: 400 });
  //   }
  const newIssue = await prisma.comment.create({
    data: {
      message: body.message,
      issueId: body.issueId,
      userId: session.user!.id,
    },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
