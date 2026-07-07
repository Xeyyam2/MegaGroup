"use client";
import { useState } from "react";

export function ConfirmDelete({ onConfirm, itemName }: { onConfirm: () => void; itemName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-red-400 transition-colors hover:text-red-300"
      >
        Sil
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="glass w-full max-w-sm rounded-2xl p-6">
            <h3 className="font-heading text-lg font-bold">Silinsin?</h3>
            <p className="mt-2 text-sm text-foreground/60">
              &ldquo;{itemName}&rdquo; silinəcək. Geri alına bilməz.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm transition-colors hover:bg-white/10"
              >
                İmtina
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}