"use client";

import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";

// Clerk Auth Component
function Auth() {
  return (
    <div className="flex gap-1 items-center">
      <Unauthenticated>
        <SignInButton>
          <Button size="sm">登录</Button>
        </SignInButton>
      </Unauthenticated>
      <Authenticated>
        <OrganizationSwitcher />
        <UserButton />
      </Authenticated>
    </div>
  );
}

export default Auth;
