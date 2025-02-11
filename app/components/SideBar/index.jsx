"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Star } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

function SideBar() {
  const pathname = usePathname();
  return (
    <div className="w-40 flex flex-col items-start gap-2">
      <Link href="/files">
        <Button variant="link" className={clsx("flex gap-1 items-center", {
            "text-blue-500": pathname.includes("files")
        })}>
          <Package />
          存储
        </Button>
      </Link>
      <Link href="/favorites">
        <Button variant="link" className={clsx("flex gap-1 items-center", {
            "text-blue-500": pathname.includes("favorites")
        })}>
          <Star />
          收藏
        </Button>
      </Link>
    </div>
  );
}

export default SideBar;
