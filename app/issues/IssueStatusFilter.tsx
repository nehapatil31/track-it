"use client";
import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const statuses: { label: string; value: Status | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];
const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select.Root
      defaultValue={searchParams.get("status") || "ALL"}
      onValueChange={(value: string) => {
        const query = new URLSearchParams();
        if (searchParams.get("orderBy")) {
          query.set("orderBy", searchParams.get("orderBy") as string);
        }
        if (searchParams.get("order")) {
          query.set("order", searchParams.get("order") as string);
        }
        if (value !== "ALL") {
          query.set("status", value);
        }
        const queryStr = query.size ? "?" + query.toString() : "";
        router.push("/issues" + queryStr);
      }}
    >
      <Select.Trigger placeholder="Filter by status..."></Select.Trigger>
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item key={status.value} value={status.value}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
