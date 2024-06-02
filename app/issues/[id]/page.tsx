import authoptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { Event } from "@prisma/client";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { cache } from "react";
import AssineeSelect from "./AssigneeSelect";
import EditIssueButton from "./EditIssueButton";
import History from "./History";
import IssueDetail from "./IssueDetail";
import StatusSelect from "./StatusSelect";

interface Props {
  params: { id: string };
}
const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);
const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authoptions);

  const issueDetail = await fetchUser(parseInt(params.id));

  if (!issueDetail) notFound();

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Box>
        <IssueDetail issue={issueDetail} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <StatusSelect issue={issueDetail} />
            <AssineeSelect issue={issueDetail} />
            <EditIssueButton issueId={issueDetail.id} />
          </Flex>
        </Box>
      )}
      {!session && <Text size={"2"}>Log in to update this issue</Text>}
      <History issueDetail={issueDetail} />
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id));
  return {
    title: `Issue Tracker - ${issue?.title}`,
    description: issue?.description,
  };
}
export default IssueDetailPage;
