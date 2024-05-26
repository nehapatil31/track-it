import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}
const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const statusContainers: { label: string; count: number; status: Status }[] = [
    { label: "Open issues", count: open, status: "OPEN" },
    { label: "In progress issues", count: inProgress, status: "IN_PROGRESS" },
    { label: "Closed issues", count: closed, status: "CLOSED" },
  ];
  return (
    <Flex gap={"4"}>
      {statusContainers.map((container) => (
        <Card key={container.label}>
          <Flex direction={"column"} gap="1">
            <Link
              className="text-sm font-medium"
              href={`/issues/list?status=${container.status}`}
            >
              {container.label}
            </Link>
            <Text size="5" className="font-bold">
              {container.count}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
