"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  return (
    <Button>
      {/* <Pencil2Icon /> */}
      <Link style={{ width: "100%" }} href={`/issues/${issueId}/edit`}>
        Edit Issue
      </Link>
    </Button>
  );
};

export default EditIssueButton;
