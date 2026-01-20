"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function AuthUserButtonWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  return (
    <div className="flex items-center">
      <SignedOut>
        {/* Text needs slight vertical correction */}
        <Link
          href="/sign-in"
          className="
            px-4
            text-sm
            font-medium
            text-white
            leading-none
            relative
            top-[3px]
            sm:top-2
          "
        >
          Sign In
        </Link>
      </SignedOut>

      <SignedIn>
        {/* Avatar is already vertically centered by Clerk */}
        <UserButton afterSignOutUrl="/sign-in" />
      </SignedIn>
    </div>
  );
}
