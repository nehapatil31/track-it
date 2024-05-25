import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import IssueStatusBadge from "../components/IssueStatusBadge";
import Link from "../components/Link";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: { status: Status; orderBy: keyof Issue; order: "asc" | "desc" };
}
const IssuesPage = async ({ searchParams }: Props) => {
  console.log(searchParams.status);
  const status = Object.values(Status).includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const issues = await prisma.issue.findMany({
    where: {
      status: status,
    },
  });
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
    </div>
  );
};

export const dynamic = "force-dynamic";

export default IssuesPage;
