"use client";
import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";
import Tilt from "react-parallax-tilt";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { University } from "@/types";

export function UniversityCard({
  university,
  localePrefix = "",
}: {
  university: University;
  localePrefix?: string;
}) {
  const reduced = useReducedMotion();
  const tCommon = useTranslations("common");
  const isCoarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const useTilt = !reduced && !isCoarse;

  const card = (
    <div
      className={cn(
        "glass shadow-brand-hover overflow-hidden rounded-2xl",
        university.is_featured && "ring-2 ring-brand-accent",
      )}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <SmartImage
          src={university.hero_image_url}
          alt={university.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-lg font-bold text-foreground">{university.name}</h3>
          {university.is_featured && (
            <span className="rounded-full bg-brand-accent/20 px-2 py-0.5 text-xs font-medium text-brand-accent">
              {tCommon("featured")}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-foreground/60">{university.city}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {university.highlights.slice(0, 3).map((h) => (
            <span key={h} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-foreground/70">
              {h}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-foreground/70">
          {tCommon("tuition")}: ${university.fees.tuition_min_usd}–$
          {university.fees.tuition_max_usd}
          {tCommon("perYear")}
        </p>
      </div>
    </div>
  );

  return (
    <Link
      href={`${localePrefix}/xaricde-tehsil/${university.country_slug}/${university.slug}`}
      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
    >
      {useTilt ? (
        <Tilt glareEnable scale={1.02} tiltMaxAngleX={8} tiltMaxAngleY={8}>
          {card}
        </Tilt>
      ) : (
        card
      )}
    </Link>
  );
}