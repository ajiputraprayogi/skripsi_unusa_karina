"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { HiUserCircle, HiLogout } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({
  brand = "Monarch",
  links = [
    { label: "Login", href: "/logging" },
    { label: "Register", href: "/register" },
    // { label: "Harga & Layanan", href: "/pricing" },
    // { label: "Portfolio", href: "/portfolio" },
    // {
    //   label: "Portfolio",
    //   dropdown: [
    //     { label: "Desain Rumah", href: "/rumah" },
    //     { label: "Desain Interior", href: "/interior" },
    //     { label: "Desain Eksterior", href: "/eksterior" },
    //   ],
    // },
    // { label: "Harga", href: "/harga" },
    // { label: "Kontak", href: "/kontak" },
    // { label: "Informasi", href: "/information" },
    // { label: "Kontak", href: "/contact" },
  ],
}) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const panel = {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0, transition: { stiffness: 400, damping: 30 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
  };

    const pathname = usePathname();

  const hiddenNavbarRoutes = [
    "/logging",
    "/register",
    "/quiz",
    "/dashboard",
  ];

  // untuk route dinamis (contoh /dashboard/xxx)
  const shouldHideNavbar =
    hiddenNavbarRoutes.includes(pathname) ||
    pathname.startsWith("/dashboard/");

  if (shouldHideNavbar) return null;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 ">
      <nav className="mx-auto w-full bg-white/15 backdrop-blur-md border border-[#14100c]/15 rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
            <Link href={"/"}>
            <Image
              src="/images/brand/logos.png"
              alt="Brand Logo"
              width={24}
              height={24}
              className="object-contain"
            />
            </Link>
          </span>
          {/* <span className="font-semibold text-white">{brand}</span> */}
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 relative">
          {links.map((l) =>
            l.dropdown ? (
              <li
                key={l.label}
                className="relative group"
                onMouseEnter={() => setDropdownOpen(l.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button className="flex items-center gap-1 text-sm text-[#2f3542] transition-colors">
                  {l.label}
                  <HiChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen === l.label && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-black/80 border border-white/10 shadow-lg backdrop-blur-lg p-2 flex flex-col"
                    >
                      {l.dropdown.map((d) => (
                        <li key={d.href}>
                          <Link
                            href={d.href}
                            className="block px-3 py-2 text-sm text-[#ced6e0]/90 hover:text-black hover:bg-[#BFA98E] rounded-lg"
                          >
                            {d.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="relative text-sm text-[#2f3542] hover:text-pink-400 transition-colors 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 
                    after:w-full after:h-[1px] after:bg-pink-400 after:scale-x-0
                    after:origin-left after:transition-transform after:duration-300 
                    hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          {/* <Link
            href="/portfolio"
            className="hidden md:inline-block text-white text-sm px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/6 hover:bg-white/12 transition"
          >
            Portfolio
          </Link> */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="md:hidden p-2 rounded-lg text-black transition"
          >
            {open ? (
              <HiX className="w-6 h-6 text-[#2E2B25]" />
            ) : (
              <HiMenu className="w-6 h-6 text-[#2E2B25]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

            <motion.div
              className="absolute left-4 right-4 top-20 rounded-2xl bg-white/6 border border-white/6 p-6 mx-4"
              variants={panel}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="flex flex-col gap-4">
                {links.map((l) =>
                  l.dropdown ? (
                    <li key={l.label}>
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg text-white/95 text-lg font-medium hover:bg-white/4">
                          {l.label}
                          <HiChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <ul className="pl-4 mt-2 flex flex-col gap-2">
                          {l.dropdown.map((d) => (
                            <li key={d.href}>
                              <Link
                                href={d.href}
                                className="block text-white/80 text-sm px-2 py-1 rounded hover:bg-white/5"
                                onClick={() => setOpen(false)}
                              >
                                {d.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="block text-white/95 text-lg font-medium py-2 px-2 rounded-lg hover:bg-white/4 transition"
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>

              {/* <div className="mt-6">
                <Link
                  href="/portfolio"
                  className="block text-center text-sm text-white px-4 py-2 rounded-lg bg-white/10 border border-white/6"
                  onClick={() => setOpen(false)}
                >
                  Portfolio
                </Link>
              </div> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}