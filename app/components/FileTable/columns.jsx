"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { FileActionsDropdown } from "../FileAction";

function UserCell({ userId }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId,
  });
  return (
    <div className="flex items-center gap-1">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>{userProfile?.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{userProfile?.name}</span>
    </div>
  );
}

// (client component) will contain our column definitions
export const columns = [
  {
    accessorKey: "name",
    header: "文件名",
  },
  {
    accessorKey: "type",
    header: "文件类型",
  },
  {
    header: "用户",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    header: "上传时间",
    cell: ({ row }) => {
      const date = dayjs(row.original._creationTime);
      const formattedDate = date.format("YYYY年MM月DD日 HH:mm:ss");
      return <div>{formattedDate}</div>;
    },
  },
  {
    header: "操作",
    cell: ({ row }) => {
      return <FileActionsDropdown isFavorited={false} file={row.original} />;
    },
  },
];
