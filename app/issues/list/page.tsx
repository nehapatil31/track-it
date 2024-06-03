import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";
import Pagination from "../../components/Pagination";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery, IssueType } from "./IssueTable";

interface Props {
  searchParams: IssueQuery;
}
const IssuesPage = async ({ searchParams }: Props) => {
  const status = Object.values(Status).includes(searchParams.status)
    ? searchParams.status
    : undefined;

  let orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.order }
    : undefined;

  //If no orderby param set then show latest created issue on top
  if (!searchParams.orderBy) {
    orderBy = { createdAt: "desc" };
  }
  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;
  const where: { status?: Status; assignedToUserId?: string | null } = {
    status,
  };
  if (searchParams.assignee && searchParams.assignee !== "UNASSIGNED") {
    where.assignedToUserId = searchParams.assignee;
  }
  if (searchParams.assignee && searchParams.assignee === "UNASSIGNED") {
    where.assignedToUserId = null;
  }
  const issues: IssueType[] = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      assignedToUserId: true,
      assignedToUser: {
        select: { image: true, name: true },
      },
    },
  });
  const itemCount = await prisma.issue.count({
    where,
  });

  return (
    <Flex direction={"column"} gap="2">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        currentPage={page}
        itemCount={itemCount}
        pageSize={pageSize}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues and bugs",
};

export default IssuesPage;
