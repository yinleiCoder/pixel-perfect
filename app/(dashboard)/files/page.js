"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import FileCard from "@/app/components/Card";
import { UploadButton } from "@/app/components/UploadButton";
import SearchBar from "@/app/components/SearchBar";
import { DataTable } from "@/app/components/FileTable";
import { columns } from "@/app/components/FileTable/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FilesPage() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const user = useUser();
  const organization = useOrganization();

  let orgId = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          query,
          type: selectedType === "all" ? undefined : selectedType,
        }
      : "skip"
  );
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
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">网格</TabsTrigger>
            <TabsTrigger value="table">表格</TabsTrigger>
          </TabsList>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="image">图片</SelectItem>
              <SelectItem value="audio">音频</SelectItem>
              <SelectItem value="video">视频</SelectItem>
              <SelectItem value="zip">压缩包</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
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
        <TabsContent value="grid">
          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return (
                <FileCard
                  key={file._id}
                  file={file}
                  favorites={favorites ?? []}
                />
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={files ?? []} />
        </TabsContent>
      </Tabs>
    </>
  );
}
