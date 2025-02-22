"use client";

import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";

// Clerk Auth Component
function Auth() {
  return (
    <>
      <Unauthenticated>
        <SignInButton>
          <Button>登录</Button>
        </SignInButton>
      </Unauthenticated>
      <Authenticated>
        <OrganizationSwitcher />
        <UserButton />
      </Authenticated>
    </>
  );
}

export default Auth;
