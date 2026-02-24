"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi"
import { signOut } from "next-auth/react"

type Props = {
  name: string
  email: string
  avatar?: string | null
}

export default function UserNavbar({ name, email, avatar }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="z-99 fixed top-0 left-0 w-full border-b border-white/10 bg-pink-500 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full px-2 py-1 text-white hover:bg-white/10 transition"
          >
            {/* <Image
              src={avatar || "/avatar-default.png"}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full object-cover"
            /> */}

            <span className="hidden sm:block text-sm font-medium">
              {name}
            </span>

            <FiChevronDown
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-pink-900 shadow-xl overflow-hidden"
              >
                {/* USER INFO */}
                <div className="px-4 py-3 border-b border-white/10">
                  {/* <p className="text-sm font-semibold text-white">
                    {name}
                  </p> */}
                  <p className="text-xs text-white truncate">
                    Email : {email}
                  </p>
                </div>

                {/* MENU */}
                <div className="flex flex-col">
                  {/* <button
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition"
                  >
                    <FiUser />
                    Profile
                  </button> */}

                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-red-500/10 transition"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}