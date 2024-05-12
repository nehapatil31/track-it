import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import prisma from "@/prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  params: { id: string };
}
const IssueDetail = async ({ params }: Props) => {
  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issueDetail) notFound();
  return (
    <div>
      <Heading>Title: {issueDetail.title}</Heading>
      <Flex className="space-x-3" my="2">
        <IssueStatusBadge status={issueDetail.status}></IssueStatusBadge>
        <Text> {issueDetail.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="prose" mt="4">
        <ReactMarkdown>{issueDetail.description}</ReactMarkdown>
      </Card>
    </div>
  );
};

export default IssueDetail;
