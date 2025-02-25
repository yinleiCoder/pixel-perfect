"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { ArchiveBoxIcon, StarIcon } from "@heroicons/react/24/solid";

function SideBar() {
  const pathname = usePathname();
  return (
    <div className="w-full md:w-40 flex flex-row md:flex-col items-start gap-2">
      <Link href="/files">
        <Button
          variant="link"
          className={clsx("flex gap-1 items-center", {
            "text-red-500": pathname.includes("files"),
          })}
        >
          <ArchiveBoxIcon />
          存储
        </Button>
      </Link>
      <Link href="/favorites">
        <Button
          variant="link"
          className={clsx("flex gap-1 items-center", {
            "text-red-500": pathname.includes("favorites"),
          })}
        >
          <StarIcon />
          收藏
        </Button>
      </Link>
    </div>
  );
}

export default SideBar;
