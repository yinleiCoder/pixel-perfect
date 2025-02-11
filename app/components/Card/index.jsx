"use client";

import {
  AudioLines,
  Clapperboard,
  EllipsisVertical,
  File,
  FileText,
  Image as LucideImage,
  Package,
  Star,
  StarHalf,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function CardActionsDropdown({ file, isFavorited }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除?</AlertDialogTitle>
            <AlertDialogDescription>
              删除
              <span className="px-1 py-1 text-red-500 font-bold">
                {file.name}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded mr-1">
                {file._id}
              </span>
              文件后不可恢复！
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast({
                  title: `${file.name} 已删除`,
                  description: "文件已从Convex中永久删除",
                });
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => toggleFavorite({ fileId: file._id })}
          >
            {isFavorited ? <Star fill="yellow"/> : <Star />}
            <span>{isFavorited?"已收藏":"收藏"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-1 text-red-500 cursor-pointer"
            onClick={() => setIsConfirmOpen(true)}
          >
            <TrashIcon />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function FileCard({ file, favorites }) {
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

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-1">
          {typeIcons[file.type]}
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <CardActionsDropdown isFavorited={isFavorited} file={file} />
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
      <CardFooter>
        <Button
          onClick={() => {
            // open a new tab to the file
            window.open(file.url, "_blank");
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FileCard;
