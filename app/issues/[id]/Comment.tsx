import prisma from "@/prisma/client";
import { Issue } from "@prisma/client";
import { Avatar, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { Session } from "next-auth";
import React from "react";
import AddComment from "./AddComment";

const Comment = async ({
  issueDetail,
  session,
}: {
  issueDetail: Issue;
  session: Session;
}) => {
  const comments = await prisma.comment.findMany({
    where: { issueId: issueDetail.id },
    select: {
      id: true,
      message: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <Card className="prose" mt="4">
      <h3>Comments</h3>
      <Flex align={"center"} gap="3">
        <Avatar
          src={session.user!.image!}
          fallback="?"
          size="1"
          radius="full"
        />
        <AddComment issueId={issueDetail.id} />
      </Flex>
      {comments.map((comment) => (
        <Flex key={comment.id} gap="3" className="my-4">
          <Avatar
            src={comment.user.image!}
            fallback={comment.user.name![0]}
            radius="full"
            size={"1"}
          />
          <Flex direction="column" gap={"2"}>
            <Flex gap="3" align={"center"}>
              <Text>{comment.user.name}</Text>
              <Text size="1" className="text-gray">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata",
                }).format(comment.createdAt)}
              </Text>
            </Flex>
            <Text>{comment.message}</Text>
          </Flex>
        </Flex>
      ))}
    </Card>
  );
};

export default Comment;
