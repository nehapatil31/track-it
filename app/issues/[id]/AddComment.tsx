"use client";
import { Button, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import SimpleMDE from "react-simplemde-editor";
// import dynamic from "next/dynamic";

// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
//   loading: () => <p>Loading...</p>,
// });
const AddComment = ({ issueId }: { issueId: number }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");

  const handleEdit = () => setIsEditing(true);
  const handleSave = async () => {
    setIsEditing(false);
    //call api to save the comment
    try {
      await axios.post("/api/comments", {
        message: value,
        issueId,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setValue("");
  };
  return (
    <>
      {isEditing ? (
        <div style={{ width: "100%" }}>
          {/* <SimpleMDE value={value} onChange={setValue} /> */}
          <TextField.Root
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="Add a comment..."
            size={"3"}
          ></TextField.Root>

          <Flex gap="2" className="my-2">
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>cancel</Button>
          </Flex>
        </div>
      ) : (
        <TextField.Root
          onClick={handleEdit}
          placeholder="Add a comment..."
          size={"3"}
        ></TextField.Root>
      )}
    </>
  );
};

export default AddComment;
