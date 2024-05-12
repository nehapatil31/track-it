import prisma from "@/prisma/client";
import React from "react";

interface Props {
  params: { id: string };
}
const IssueDetail = async ({ params }: Props) => {
  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  return (
    <div>
      <p>Title: {issueDetail?.title}</p>
      <p>Description: {issueDetail?.description}</p>
      <p>Status: {issueDetail?.status}</p>
      <p>CreatedAt: {issueDetail?.createdAt.toDateString()}</p>
    </div>
  );
};

export default IssueDetail;
