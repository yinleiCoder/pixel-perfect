"use client";

import { CloudDownload, EllipsisVertical, Star, TrashIcon } from "lucide-react";
import { Protect } from "@clerk/nextjs";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
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

export function FileActionsDropdown({ file, isFavorited }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();
  const me = useQuery(api.users.getMe);
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
                  storageId: file.fileId,
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
            onClick={() => {
              window.open(file.url, "_blank");
            }}
          >
            <CloudDownload />
            <span>下载</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => toggleFavorite({ fileId: file._id })}
          >
            {isFavorited ? <Star fill="yellow" /> : <Star />}
            <span>{isFavorited ? "已收藏" : "收藏"}</span>
          </DropdownMenuItem>
          <Protect
            condition={(has) =>
              has({ role: "org:admin" }) || file.userId === me?._id
            }
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-1 text-red-500 cursor-pointer"
              onClick={() => setIsConfirmOpen(true)}
            >
              <TrashIcon />
              <span>删除</span>
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
