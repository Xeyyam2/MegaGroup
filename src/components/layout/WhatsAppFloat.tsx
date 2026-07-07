"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function WhatsAppFloat({ href = "https://wa.me/994519999370" }: { href?: string }) {
  const reduced = useReducedMotion();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ilə əlaqə"
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 ring-2 ring-green-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-green-400/40" aria-hidden />
      <motion.span
        className="relative"
        whileHover={reduced ? undefined : { scale: 1.1 }}
        whileTap={reduced ? undefined : { scale: 0.95 }}
      >
        <MessageCircle size={26} />
      </motion.span>
    </a>
  );
}