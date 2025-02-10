import { Button } from "@/components/ui/button";
import {
  UserButton,
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  ClerkLoaded,
} from "@clerk/nextjs";

function Header() {
  return (
    <div className="border-b py-4 bg-slate-50">
      <div className="container mx-auto flex justify-between items-center">
        <div>Pixel Perfect</div>
        <div className="flex items-center gap-4">
          <ClerkLoaded>
            <OrganizationSwitcher />
            <UserButton />
            <SignedOut>
              <SignInButton>
                <Button>登录</Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}

export default Header;
