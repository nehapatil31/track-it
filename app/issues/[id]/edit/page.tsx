import React from "react";
import IssueForm from "../../_components/IssueForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

const EditIssuePage = async ({ params }: { params: { id: string } }) => {
  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issueDetail) return notFound();
  return (
    <div>
      <IssueForm issue={issueDetail} />
    </div>
  );
};

export default EditIssuePage;
