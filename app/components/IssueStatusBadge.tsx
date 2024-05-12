import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";

const statusColourMap: Record<
  Status,
  { label: string; color: "red" | "orange" | "green" }
> = {
  OPEN: {
    label: "Open",
    color: "red",
  },
  IN_PROGRESS: {
    label: "In progress",
    color: "orange",
  },
  CLOSED: {
    label: "Closed",
    color: "green",
  },
};

const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <div>
      <Badge color={statusColourMap[status].color}>
        {statusColourMap[status].label}
      </Badge>
    </div>
  );
};

export default IssueStatusBadge;
