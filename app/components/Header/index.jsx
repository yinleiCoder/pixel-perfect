import { Button } from "@/components/ui/button";
import Link from "next/link";
import Auth from "../Auth";

function Header() {
  return (
    <div className="border-b py-4 bg-slate-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"}>
          <span className="font-bold animate-pulse">Pixel Perfect</span>
        </Link>
        <Button variant={"ghost"}>
          <Link href={"/files"}>软件托管</Link>
        </Button>
        <Button variant={"ghost"}>
          <Link href={"/"}>关于我</Link>
        </Button>
        <div className="flex items-center gap-4">
          <Auth />
        </div>
      </div>
    </div>
  );
}

export default Header;
