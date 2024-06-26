import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import IssueStatusFilter from "./IssueStatusFilter";
import authoptions from "@/app/api/auth/authOptions";
import { getServerSession } from "next-auth";
import { Text } from "@radix-ui/themes";
import AssigneeFilter from "./AssigneeFilter";

const IssueActions = async () => {
  const session = await getServerSession(authoptions);

  return (
    <Flex justify={"between"}>
      <Flex gap={"2"}>
        <IssueStatusFilter />
        <AssigneeFilter />
      </Flex>
      {session && (
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      )}
      {!session && <Text size={"2"}>Log in to create an issue</Text>}
    </Flex>
  );
};

export default IssueActions;
