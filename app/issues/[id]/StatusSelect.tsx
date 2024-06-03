"use client";
import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";

const statuses: { label: string; value: Status }[] = [
  { label: "Open", value: "OPEN" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const StatusSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const updateStatus = (status: string) => {
    // async () => {
    console.log("status", status);
    axios
      .patch(`/api/issues/${issue.id}`, { status })
      .then(() => {
        router.refresh();
        toast.success("Status is successfully updated.");
      })
      .catch(() => {
        toast.error("Failed to update status");
      });
    //   router.refresh();
    // };
  };

  return (
    <>
      <Select.Root defaultValue={issue.status} onValueChange={updateStatus}>
        <Select.Trigger placeholder="Update status..." />
        <Select.Content>
          <Select.Group>
            {statuses?.map((status) => (
              <Select.Item key={status.value} value={status.value}>
                {status.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default StatusSelect;
