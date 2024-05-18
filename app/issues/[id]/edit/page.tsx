import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import IssueFormSkeleton from "./loading";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

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
