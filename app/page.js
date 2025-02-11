"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { UploadButton } from "./components/UploadButton";
import FileCard from "./components/Card";

export default function Home() {
  const user = useUser();
  const organization = useOrganization();

  let orgId = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto pt-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl">组织空间</span>
        <UploadButton />
      </div>
      {files && files.length === 0 && (
        <div className="relative w-full min-h-[50vh] flex justify-center items-center mt-20">
          <Image src={"/empty.svg"} alt="empty" fill className="object-contain select-none" />
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
