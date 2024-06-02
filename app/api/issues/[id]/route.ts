import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { pathchIssueSchema } from "../../../validationSchemas";
import { getServerSession, Session } from "next-auth";
import authoptions from "../../auth/authOptions";
import { Event, Issue, Status } from "@prisma/client";

async function updateHistory(
  issue: Issue,
  {
    title,
    description,
    assignedToUserId,
    status,
  }: {
    title: string | null;
    description: string | null;
    assignedToUserId: string | null;
    status: Status | null;
  },
  session: Session
) {
  const historyRecords: {
    issueId: number;
    userId: string;
    type: Event;
    field: string | null;
    newValue: string | null;
    oldValue: string | null;
  }[] = [];
  if (title) {
    historyRecords.push({
      issueId: issue.id,
      userId: session.user!.id,
      type: "UPDATED",
      field: "title",
      oldValue: issue.title,
      newValue: title,
    });
  }
  if (description) {
    historyRecords.push({
      issueId: issue.id,
      userId: session.user!.id,
      type: "UPDATED",
      field: "description",
      oldValue: issue.description,
      newValue: description,
    });
  }
  if (status) {
    historyRecords.push({
      issueId: issue.id,
      userId: session.user!.id,
      type: "UPDATED",
      field: "status",
      oldValue: issue.status,
      newValue: status,
    });
  }
  if (assignedToUserId) {
    historyRecords.push({
      issueId: issue.id,
      userId: session.user!.id,
      type: "UPDATED",
      field: "assignedToUserId",
      oldValue: issue.assignedToUserId,
      newValue: assignedToUserId,
    });
  }
  await prisma.history.createMany({
    data: historyRecords,
  });
}

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

  const { assignedToUserId, title, description, status } = body;
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
    data: { title, description, assignedToUserId, status },
  });
  updateHistory(
    issue,
    { title, description, assignedToUserId, status },
    session
  );
  return NextResponse.json(updatedIssue);
}
