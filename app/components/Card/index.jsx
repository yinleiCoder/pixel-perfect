"use client";

import {
  AudioLines,
  Clapperboard,
  File,
  FileText,
  Image as LucideImage,
  Package,
} from "lucide-react";
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

function FileCard({ file, favorites }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  const typeIcons = {
    image: <LucideImage />,
    audio: <AudioLines />,
    video: <Clapperboard />,
    pdf: <FileText />,
    zip: <Package />,
    other: <File />,
  };
  const isFavorited = favorites?.some(
    (favorite) => favorite.fileId === file._id
  );
  const date = dayjs(file._creationTime)
  const formattedDate = date.format("YYYY年MM月DD日 HH:mm:ss")

  return (
    <Card>
      <CardHeader className="relative p-4">
        <CardTitle className="flex items-center text-base font-normal gap-1">
          {typeIcons[file.type]}
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileActionsDropdown isFavorited={isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="relative aspect-video flex justify-center items-center">
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
      <CardFooter className="flex justify-between items-center p-4 text-sm text-gray-500">
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
