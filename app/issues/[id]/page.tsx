import authoptions from "@/app/api/auth/authOptions";
import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetail from "./IssueDetail";
import AssineeSelect from "./AssineeSelect";

interface Props {
  params: { id: string };
}
const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authoptions);

  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issueDetail) notFound();
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Box>
        <IssueDetail issue={issueDetail} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssineeSelect />
            <EditIssueButton issueId={issueDetail.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
