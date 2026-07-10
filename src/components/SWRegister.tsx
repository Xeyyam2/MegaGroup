"use client";

import { useEffect } from "react";

// Service worker-i yalniz production-da qeydiyyatdan kecir.
export function SWRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // SW registration failed — silent fail, not critical.
    });
  }, []);
  return null;
}
