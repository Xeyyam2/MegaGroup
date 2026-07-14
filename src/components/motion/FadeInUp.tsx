"use client";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Kanonik "client-də mount olub?" yoxlaması — setState-in effect-də çağrılmasına
// ehtiyac yoxdur (react-hooks/set-state-in-effect qaydasını pozmadan).
// SSR-də false, client-də true qaytarır.
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function FadeInUp({ children, className, delay = 0 }: FadeInUpProps) {
  const reduced = useReducedMotion();
  // SSR və ilk client render-də məzmun dərhal görünür (opacity:0 inline style YOXDUR
  // → Googlebot məzmunu oxuyur). Mount-dan sonra framer-motion fade-in-up işə düşür.
  const mounted = useIsClient();

  if (reduced || !mounted) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
