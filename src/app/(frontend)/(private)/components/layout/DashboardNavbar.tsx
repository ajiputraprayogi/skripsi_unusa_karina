"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { FiChevronDown, FiLogOut, FiMenu, FiX } from "react-icons/fi"
import { signOut } from "next-auth/react"

type Props = {
  name: string
  email: string
  avatar?: string | null
}

export default function UserNavbar({ name, email, avatar }: Props) {
  console.log(avatar);
  const [openUser, setOpenUser] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  const menuStyle =
    "px-4 py-1 rounded-full bg-white/15 hover:bg-white/30 transition text-white text-sm font-medium"

  const userStyle =
    "flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium bg-white text-pink-600 hover:bg-pink-50 transition"

  return (
    <nav className="z-50 fixed top-0 left-0 w-full border-b border-white/10 bg-pink-500 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* HAMBURGER */}
        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="md:hidden text-white text-xl"
        >
          {openMobile ? <FiX /> : <FiMenu />}
        </button>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-3">

          <Link href="/pretest" className={menuStyle}>
            Pre Test
          </Link>

          <Link href="/materi" className={menuStyle}>
            Pengenalan
          </Link>

          <Link href="/video-materi" className={menuStyle}>
            Video Materi
          </Link>

          {/* <Link href="/posttest" className={menuStyle}>
            Post Test
          </Link> */}

        </div>

        {/* USER */}
        <div className="relative">
          <button
            onClick={() => setOpenUser(!openUser)}
            className={userStyle}
          >
            <span className="max-w-[120px] truncate">
              {name}
            </span>

            <FiChevronDown
              className={`transition-transform ${
                openUser ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openUser && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-pink-900 shadow-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs text-white truncate">
                    Email : {email}
                  </p>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-red-500/20 transition"
                >
                  <FiLogOut />
                  Logout
                </button>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 px-4 pb-4"
          >
            <div className="flex flex-col gap-3 pt-3">

              <Link
                href="/pretest"
                className={menuStyle}
                onClick={() => setOpenMobile(false)}
              >
                Pre Test
              </Link>

              <Link
                href="/materi"
                className={menuStyle}
                onClick={() => setOpenMobile(false)}
              >
                Pengenalan
              </Link>

              <Link
                href="/video-materi"
                className={menuStyle}
                onClick={() => setOpenMobile(false)}
              >
                Video Materi
              </Link>

              <Link
                href="/posttest"
                className={menuStyle}
                onClick={() => setOpenMobile(false)}
              >
                Post Test
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  )
}