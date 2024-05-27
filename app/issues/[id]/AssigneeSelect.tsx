"use client";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AssineeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) return <Skeleton />;
  if (error) return null;

  const assignIssue = (userId: string) => {
    axios
      .patch(`/api/issues/${issue.id}`, {
        assignedToUserId: userId == "nouser" ? null : userId,
      })
      .catch(() => {
        toast.error("Failed to assign user");
      });
  };

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "nouser"}
        onValueChange={assignIssue}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="nouser">Unassigned</Select.Item>
            {users?.map((i) => (
              <Select.Item key={i.id} value={i.id}>
                {i.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get<User[]>("/api/users").then((res) => res.data),
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minutes
  });

export default AssineeSelect;
