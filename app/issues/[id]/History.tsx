import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import prisma from "@/prisma/client";
import { Event, Issue, Status } from "@prisma/client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Card, Flex, Avatar, Text } from "@radix-ui/themes";
import events from "events";
import React from "react";

type EventType = {
  type: Event;
  createdAt: Date;
  field: string | null;
  newValue: string | null;
  oldValue: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
  oldUser?: {
    name: string | null;
    image: string | null;
  };
  newUser?: {
    name: string | null;
    image: string | null;
  };
};
const History = async ({ issueDetail }: { issueDetail: Issue }) => {
  const getFormattedDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(date);
  };
  const events: EventType[] = await prisma.history.findMany({
    where: { issueId: issueDetail.id },
    select: {
      type: true,
      createdAt: true,
      field: true,
      oldValue: true,
      newValue: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  //get user details
  const userIds: string[] = [];
  events.forEach((event) => {
    if (event.field === "assignedToUserId" && event.newValue) {
      event.field = "assignee";
      if (event.oldValue) {
        //if it is unassigned then oldValue will be null
        userIds.push(event.oldValue);
      }
      if (event.newValue) {
        //if I assign issue to no one then newValue will be null
        userIds.push(event.newValue);
      }
    }
  });
  const uniqueUserIds = Array.from(new Set(userIds));
  let userDetails: {
    id: string;
    name: string | null;
    image: string | null;
  }[] = [];
  if (userIds.length) {
    userDetails = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueUserIds,
        },
      },
      select: { name: true, image: true, id: true },
    });
  }
  events.forEach((event) => {
    if (event.field === "assignee") {
      event.oldUser = event.oldValue
        ? userDetails.find((user) => user.id === event.oldValue)
        : undefined;
      event.newUser = event.newValue
        ? userDetails.find((user) => user.id === event.newValue)
        : undefined;
    }
  });

  if (events.length == 0) {
    return <Text size="2">No history available</Text>;
  }
  return (
    <Card className="prose" mt="4">
      <h3>Issue history</h3>
      {events &&
        events.map((event) => {
          return (
            <div className="my-8">
              <Flex align={"center"} gap={"2"} className="my-2">
                <Avatar
                  src={event.user.image!}
                  fallback={event.user.name![0]}
                  radius="full"
                  size={"1"}
                />
                {event.user.name}{" "}
                {event.type === "CREATED" && ("created this issue" as string)}
                {event.type === "UPDATED" && (
                  <>
                    updated the
                    <span className="font-semibold">{event.field}.</span>
                  </>
                )}
                {<Text size="1">{getFormattedDate(event.createdAt)}</Text>}
              </Flex>
              {event.type === "UPDATED" && (
                <Flex align={"center"} gap={"2"} className="my-2">
                  {event.field === "assignee" && (
                    <>
                      {event.oldUser && (
                        <>
                          <Avatar
                            src={event.oldUser!.image!}
                            fallback={event.oldUser!.name![0]}
                            radius="full"
                            size={"1"}
                          />
                          <Text size="1">{event.oldUser!.name}</Text>
                        </>
                      )}
                      {!event.oldUser && <Text size="1">Unassigned</Text>}
                      <ArrowRightIcon />
                      {!event.newUser && <Text size="1">Unassigned</Text>}
                      {event.newUser && (
                        <>
                          <Avatar
                            src={event.newUser!.image!}
                            fallback={event.newUser!.name![0]}
                            radius="full"
                            size={"1"}
                          />
                          <Text size="1">{event.newUser!.name}</Text>
                        </>
                      )}
                    </>
                  )}
                  {event.field === "status" && (
                    <>
                      <IssueStatusBadge status={event.oldValue as Status} />
                      <ArrowRightIcon />
                      <IssueStatusBadge status={event.newValue as Status} />
                    </>
                  )}
                  {event.field !== "status" && event.field !== "assignee" && (
                    <>
                      <Text size="2">{event.oldValue}</Text>
                      <ArrowRightIcon />
                      <Text size="2">{event.newValue}</Text>
                    </>
                  )}
                </Flex>
              )}
            </div>
          );
        })}
    </Card>
  );
};

export default History;
