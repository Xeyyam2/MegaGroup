"use client";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { universities } from "@/data/universities";
import type { Testimonial } from "@/types";

export function SuccessStories({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const reduced = useReducedMotion();
  const isCoarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const useTilt = !reduced && !isCoarse;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => {
        const uni = universities.find((u) => u.slug === t.university_slug);
        const card = (
          <div className="glass h-full rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Image
                src={t.photo_url}
                alt={t.student_name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <div className="font-semibold text-foreground">
                  {t.student_name}
                </div>
                <div className="text-xs text-foreground/60">
                  {uni?.name ?? t.university_slug} · {t.year}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-foreground/80">
              &ldquo;{t.quote}&rdquo;
            </p>
          </div>
        );
        return (
          <FadeInUp key={t.id} delay={i * 0.1}>
            {useTilt ? (
              <Tilt glareEnable scale={1.02} tiltMaxAngleX={6} tiltMaxAngleY={6}>
                {card}
              </Tilt>
            ) : (
              card
            )}
          </FadeInUp>
        );
      })}
    </div>
  );
}
