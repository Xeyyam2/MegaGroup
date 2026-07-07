"use client";
import { useTransition } from "react";
import { deleteTestimonial } from "./actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export function DeleteTestimonialButton({ id, name }: { id: string; name: string }) {
  const [, startTransition] = useTransition();
  return <ConfirmDelete itemName={name} onConfirm={() => startTransition(async () => { await deleteTestimonial(id); })} />;
}