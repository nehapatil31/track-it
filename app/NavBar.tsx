import Link from "next/link";
import React from "react";
import { PiPath } from "react-icons/pi";

const NavBar = () => {
  let links = [
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
            href={i.href}
            className="text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            {i.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
