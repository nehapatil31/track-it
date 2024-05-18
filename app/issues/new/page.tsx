"use client";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import IssueFormSkeleton from "./loading";

export const IssueForm = dynamic(
  () => import("@/app/issues/_components/IssueForm"),
  { ssr: false, loading: () => <IssueFormSkeleton /> }
);

const NewIssuePage = () => {
  return (
    <>
      <IssueForm />
    </>
  );
};

export default NewIssuePage;
