"use client";

import Link from "next/link";
import React from "react";
import { PiPath } from "react-icons/pi";
import { usePathname } from "next/navigation";
import classnames from "classnames";

const NavBar = () => {
  const pathname = usePathname();

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
          <Link
            key={i.href}
            href={i.href}
            className={classnames({
              "text-zinc-100": pathname == i.href,
              "text-zinc-500": pathname != i.href,
              "hover:text-zinc-100 transition-colors": true,
            })}
          >
            {i.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
