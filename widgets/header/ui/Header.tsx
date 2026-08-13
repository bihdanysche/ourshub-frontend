"use client";

import Image from "next/image";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

export default function Header() {
  return (
    <header className="border-overlay bg-default sticky top-0 z-50 border">
      <div className="mx-auto flex w-full max-w-(--page-width) items-center justify-between px-4 sm:px-6 py-4">
        <Link
          href="/"
          className="relative flex cursor-pointer flex-row items-center justify-center gap-3 active:top-px"
        >
          <Image
            className="relative -top-1"
            src="/app_icon.png"
            alt="Logo"
            width={65}
            height={65}
          />
          <p className="text-3xl font-semibold">OursHub</p>
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}
