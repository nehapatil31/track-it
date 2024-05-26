import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import IssueStatusBadge from "../components/IssueStatusBadge";
import Link from "../components/Link";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "../components/Pagination";

interface Props {
  searchParams: {
    status: Status;
    orderBy: keyof Issue;
    order: "asc" | "desc";
    page: string;
  };
}
const IssuesPage = async ({ searchParams }: Props) => {
  const columns: {
    title: string;
    value: keyof Issue;
    className?: string;
  }[] = [
    {
      title: "Issue",
      value: "title",
    },
    {
      title: "Status",
      value: "status",
      className: "hidden md:table-cell",
    },
    { title: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const status = Object.values(Status).includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy = columns
    .map((column) => column.value)
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: searchParams.order }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;
  const where = {
    status,
  };
  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const itemCount = await prisma.issue.count({
    where,
  });

  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className ? column.className : ""}
              >
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      orderBy: column.value,
                      order: searchParams.order === "asc" ? "desc" : "asc",
                    },
                  }}
                >
                  {column.title}
                </NextLink>
                {column.value === searchParams.orderBy &&
                  searchParams.order === "asc" && (
                    <ArrowUpIcon className="inline" />
                  )}
                {column.value === searchParams.orderBy &&
                  searchParams.order === "desc" && (
                    <ArrowDownIcon className="inline" />
                  )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        currentPage={page}
        itemCount={itemCount}
        pageSize={pageSize}
      />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default IssuesPage;
