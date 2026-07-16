import Image from "next/image";
import { editorialAuthor } from "@/data/site-authors";
import type { Locale } from "@/i18n/routing";
import { socialLinks } from "@/lib/social-links";

/**
 * Bloq məqaləsi altında görünən müəllif/bio kartı.
 *
 * E-E-A-T siqnalı: oxucu (və AI/crawler) məzmunun hansı ekspertizaya
 * söykəndiyini görür. Yalnız AZ bloqu üçün istifadə olunur.
 */
export function AuthorBio({ locale = "az" }: { locale?: Locale }) {
  const a = editorialAuthor;
  const bio = a.bio[locale] ?? a.bio.az;
  return (
    <section
      aria-label="Müəllif"
      className="glass mt-12 rounded-2xl p-6"
      itemScope
      itemType="https://schema.org/Person"
    >
      <meta itemProp="jobTitle" content={a.jobTitle} />
      <meta itemProp="worksFor" content="MegaGroup" />
      <div className="flex items-start gap-4">
        <Image
          src={a.image}
          alt={a.name}
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 flex-shrink-0 rounded-full border border-white/15 object-cover"
          itemProp="image"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-heading text-lg font-bold text-foreground" itemProp="name">
              {a.name}
            </span>
            <span className="text-xs uppercase tracking-wide text-foreground/50">
              {a.jobTitle}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/75" itemProp="description">
            {bio}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-foreground/55">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary"
            >
              Instagram
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary"
            >
              LinkedIn
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
