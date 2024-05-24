import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pathchIssueSchema } from "../../../validationSchemas";
import { getServerSession } from "next-auth";
import authoptions from "../../auth/authOptions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authoptions);
  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }
  const body = await request.json();
  const validation = pathchIssueSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { assignedToUserId, title, description } = body;
  if (assignedToUserId) {
    const assignedUser = await prisma.user.findUnique({
      where: {
        id: assignedToUserId,
      },
    });
    if (!assignedUser) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }
  }
  //Find the issue
  const issue = await prisma.issue.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  if (!issue) {
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });
  }
  const updatedIssue = await prisma.issue.update({
    where: {
      id: parseInt(params.id),
    },
    data: { title, description, assignedToUserId },
  });
  return NextResponse.json(updatedIssue);
}
