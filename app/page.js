import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <Button>Hello World!</Button>
    </main>
  );
}
