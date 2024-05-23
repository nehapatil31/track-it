"use client";
import { User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AssineeSelect = () => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get<User[]>("/api/users").then((res) => res.data),
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <Skeleton />;
  if (error) return null;

  return (
    <Select.Root>
      <Select.Trigger placeholder="Assign..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          {users?.map((i) => (
            <Select.Item key={i.id} value={i.id}>
              {i.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssineeSelect;
