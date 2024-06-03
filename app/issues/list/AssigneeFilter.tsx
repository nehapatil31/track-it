"use client";
import { Avatar, Flex, Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { User } from "@prisma/client";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AssigneeFilter = () => {
  const { data: users, error, isLoading } = useUsers();
  const router = useRouter();
  const searchParams = useSearchParams();
  if (isLoading) return <Skeleton />;
  if (error) return null;

  return (
    <Select.Root
      defaultValue={searchParams.get("assignee") || "ALL"}
      onValueChange={(value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value !== "ALL") {
          params.set("assignee", value.toString());
          params.delete("page");
          router.push("?" + params.toString());
        } else {
          params.delete("assignee");
          params.delete("page");
          router.push("?" + params.toString());
        }
      }}
    >
      <Select.Trigger placeholder="Filter by status..."></Select.Trigger>
      <Select.Content>
        <Select.Item value="ALL">All</Select.Item>
        <Select.Item value="UNASSIGNED">Unassigned</Select.Item>
        {users?.map((i) => (
          <Select.Item key={i.id} value={i.id}>
            <Flex align={"center"} gap={"2"}>
              <Avatar
                src={i.image!}
                fallback={i.name![0]}
                radius="full"
                size={"1"}
              />
              {i.name}
            </Flex>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get<User[]>("/api/users").then((res) => res.data),
    retry: 3,
    staleTime: 1000 * 60 * 1, // 1 minutes
  });

export default AssigneeFilter;
