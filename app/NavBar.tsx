"use client";

import { Box, Container, Flex } from "@radix-ui/themes";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiPath } from "react-icons/pi";

const NavBar = () => {
  const pathname = usePathname();
  const { status, data: session } = useSession();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];
  return (
    <nav className="border-b mb-5 px-5 py-3">
      <Container>
        <Flex justify={"between"}>
          <Flex align="center" gap="3">
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
          </Flex>
          <Box>
            {status === "authenticated" && (
              <Link href="/api/auth/signout">Log out</Link>
            )}
            {status === "unauthenticated" && (
              <Link href="/api/auth/signin">Login</Link>
            )}
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
