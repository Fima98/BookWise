"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="my-10 h-10 flex justify-between gap-5">
      <Link href="/" className="flex items-center gap-1.5">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={32} />
        <span className="text-2xl font-semibold text-white">BookWise</span>
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            className={cn(
              "text-base cursor-pointer",
              pathname === "/" ? "text-light-200" : "text-light-100"
            )}
            href="/"
          >
            Search
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "text-base cursor-pointer",
              pathname === "/search" ? "text-light-200" : "text-light-100"
            )}
            href="/search"
          >
            Search
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
