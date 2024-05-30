import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import { ArrowUpIcon, ArrowDownIcon, PersonIcon } from "@radix-ui/react-icons";
import { Avatar, Table, Tooltip } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";
import { Issue, Status } from "@prisma/client";

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  order: "asc" | "desc";
  page: string;
  assignee: string;
}
export interface IssueType {
  id: number;
  title: string;
  description: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  assignedToUserId: string | null;
  assignedToUser: {
    image: string | null;
    name: string | null;
  } | null;
}

interface Props {
  searchParams: IssueQuery;
  issues: IssueType[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  return (
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
            <Table.Cell className="hidden md:table-cell">
              <Tooltip
                content={
                  issue.assignedToUser
                    ? issue.assignedToUser?.name!
                    : "Unassigned"
                }
              >
                <Avatar
                  src={
                    issue.assignedToUser?.image!
                      ? issue.assignedToUser?.image!
                      : ""
                  }
                  fallback={issue.assignedToUser?.name![0] || <PersonIcon />}
                  radius="full"
                  size={"2"}
                />
              </Tooltip>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

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
  { title: "Assigned to", value: "assignedToUserId" },
];
export const columnNames = columns.map((column) => column.value);

export default IssueTable;
