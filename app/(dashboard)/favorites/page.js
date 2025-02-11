"use client";

import FileCard from "@/app/components/Card";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

export default function FavoritesPage() {
  const user = useUser();
  const organization = useOrganization();

  let orgId = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query: "", favorites: true } : "skip"
  );
  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      {files?.map((file) => {
        return <FileCard key={file._id} file={file} favorites={favorites ?? []} />;
      })}
    </div>
  );
}
