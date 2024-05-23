import authoptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //   const session = await getServerSession(authoptions);
  //   if (!session) {
  //     return NextResponse.json({}, { status: 401 });
  //   }

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(users);
}
