import prisma from "@/prisma/client";
import { Flex, Table } from "@radix-ui/themes";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import Link from "../../components/Link";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "../../components/Pagination";
import IssueTable, { columnNames, IssueQuery, IssueType } from "./IssueTable";
import { Metadata } from "next";

interface Props {
  searchParams: IssueQuery;
}
const IssuesPage = async ({ searchParams }: Props) => {
  const status = Object.values(Status).includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.order }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;
  const where = {
    status,
  };
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
