"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileActionsDropdown } from "../FileAction";
import { useQuery } from "convex/react";
import {
  ArchiveBoxIcon,
  BookOpenIcon,
  DocumentIcon,
  MicrophoneIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

function FileCard({ file, favorites }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  const typeIcons = {
    image: <PhotoIcon className="w-1/2" strokeWidth={0.5} />,
    audio: <MicrophoneIcon className="w-1/2" strokeWidth={0.5} />,
    video: <VideoCameraIcon className="w-1/2" strokeWidth={0.5} />,
    pdf: <BookOpenIcon className="w-1/2" strokeWidth={0.5} />,
    zip: <ArchiveBoxIcon className="w-1/2" strokeWidth={0.5} />,
    other: <DocumentIcon className="w-1/2" strokeWidth={0.5} />,
  };
  const isFavorited = favorites?.some(
    (favorite) => favorite.fileId === file._id
  );
  const date = dayjs(file._creationTime);
  const formattedDate = date.format("YYYY年MM月DD日 HH:mm:ss");

  return (
    <Card className="relative group overflow-hidden rounded-tl-md rounded-tr-md">
      <CardHeader className="absolute px-1 py-px group-hover:z-20 transition group-hover:bg-black/60 group-hover:text-white w-full flex flex-row justify-between items-center">
        <CardTitle className="text-sm font-normal tracking-wider">{file.name}</CardTitle>
        <FileActionsDropdown isFavorited={isFavorited} file={file} />
      </CardHeader>
      <CardContent className="relative aspect-video flex justify-center items-center cursor-pointer">
        {file.type === "image" && (
          <Image
            src={file.url}
            alt="preview image"
            fill
            className="object-cover"
          />
        )}
        {typeIcons[file.type]}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-2 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>{userProfile?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{userProfile?.name}</span>
        </div>
        <span className="text-xs">{formattedDate}</span>
      </CardFooter>
    </Card>
  );
}

export default FileCard;
