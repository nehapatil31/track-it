import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table, Tooltip } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusBadge from "./components/IssueStatusBadge";

const LatestIssues = async () => {
  const latestIssues = await prisma.issue.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      assignedToUser: true,
    },
  });
  return (
    <Card>
      <Heading size={"4"} mb={"4"}>
        Latest Issues
      </Heading>
      <Table.Root>
        <Table.Body>
          {latestIssues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex justify={"between"}>
                  <Flex direction={"column"} gap={"2"}>
                    <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                    <IssueStatusBadge status={issue.status} />
                  </Flex>
                  {issue.assignedToUser && (
                    <Tooltip content={issue.assignedToUser.name!}>
                      <Avatar
                        src={issue.assignedToUser.image!}
                        fallback={issue.assignedToUser.name![0]}
                        radius="full"
                        size={"2"}
                      />
                    </Tooltip>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export const dynamic = "force-dynamic";

export default LatestIssues;
