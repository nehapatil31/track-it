"use client";

import Link from "next/link";
import React from "react";
import { PiPath } from "react-icons/pi";
import { usePathname } from "next/navigation";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import { Box } from "@radix-ui/themes";

const NavBar = () => {
  const pathname = usePathname();
  const { status, data: session } = useSession();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <PiPath />
      </Link>
      <ul className="flex space-x-6">
        {links.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className={classnames({
                "text-zinc-900": pathname == i.href,
                "text-zinc-500": pathname != i.href,
                "hover:text-zinc-900 transition-colors": true,
              })}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
      <Box>
        {status === "authenticated" && (
          <Link href="/api/auth/signout">Log out</Link>
        )}
        {status === "unauthenticated" && (
          <Link href="/api/auth/signin">Login</Link>
        )}
      </Box>
    </nav>
  );
};

export default NavBar;
