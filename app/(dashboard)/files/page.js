"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import FileCard from "@/app/components/Card";
import { UploadButton } from "@/app/components/UploadButton";
import SearchBar from "@/app/components/SearchBar";

export default function FilesPage() {
  const [query, setQuery] = useState("");

  const user = useUser();
  const organization = useOrganization();

  let orgId = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : "skip");
  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <SearchBar query={query} setQuery={setQuery} />
        <UploadButton />
      </div>
      {!query && files && files.length === 0 && (
        <div className="relative w-full min-h-[50vh] flex justify-center items-center mt-20">
          <Image
            src={"/empty.svg"}
            alt="empty"
            fill
            className="object-contain select-none"
          />
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => {
          return (
            <FileCard key={file._id} file={file} favorites={favorites ?? []} />
          );
        })}
      </div>
    </>
  );
}
