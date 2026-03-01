"use client";

import React from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F7F4EF] text-[#2E2B25] border-t border-[#2E2B25]/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left: Logo & Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="relative w-10 h-10">
            <Image
              src="/images/brand/logos.png" // ganti sesuai path logo kamu
              alt="Lanara Design"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Lanara Design</h2>
            <p className="text-xs opacity-70">Modern Architecture & Interior</p>
          </div>
        </motion.div>

        {/* Right: Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-5 text-xl"
        >
          <a
            href="https://instagram.com/lanara.design"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#C9A77A] transition-colors"
          >
            <FaInstagram />
          </a>
          <a
            href="https://facebook.com/lanaradesain"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#C9A77A] transition-colors"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.tiktok.com/@lanara.design"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#C9A77A] transition-colors"
          >
            <FaTiktok />
          </a>
          <a
            href="https://wa.me/6288901133932"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#C9A77A] transition-colors"
          >
            <FaWhatsapp />
          </a>
        </motion.div>
      </div>

      {/* Bottom Line */}
      <div className=" py-6 text-center text-xs opacity-70 mb-[2rem]">
        © {new Date().getFullYear()} Lanara Design — All Right Reserved.
      </div>
    </footer>
  );
}