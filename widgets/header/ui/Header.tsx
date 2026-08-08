"use client";

import Image from "next/image";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

export default function Header() {
	return (
		<header className="border-border bg-card sticky top-0 z-50 border-b">
			<div className="mx-auto flex w-(--page-width) items-center justify-between py-5">
				<Link
					href="/"
					className="relative flex cursor-pointer flex-row items-center justify-center gap-1 active:top-[1px]">
					<Image className="relative top-2" src="/logo.png" alt="Logo" width={65} height={65} />
					<p className="text-3xl font-semibold">Site.com</p>
				</Link>

				<UserMenu />
			</div>
		</header>
	);
}
