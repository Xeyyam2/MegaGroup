/**
 * Sync only the newly-added countries (Gürcüstan, Qazaxıstan) — and their
 * universities/FAQs — into the live Supabase database.
 *
 * WHY THIS SCRIPT EXISTS
 * -----------------------
 * The site reads its "Ölkələr" tabs/cards, university list, and cost
 * calculator from Supabase (not from the static files in src/data/*).
 * Gürcüstan and Qazaxıstan were fully written into the code, but that alone
 * never reaches production — the live `countries`/`universities`/`faqs`
 * tables simply don't have rows for them yet (or they exist with
 * is_active=false). Running this script is what actually makes them show
 * up on the live site.
 *
 * WHY NOT JUST RE-RUN `npm run seed`?
 * ------------------------------------
 * `seed-supabase.ts` upserts EVERY country/university (all 7) and fully
 * REPLACES all FAQs and testimonials. If you've since edited any country's
 * text, added testimonials, or added FAQs from the Admin panel, a full
 * reseed would overwrite that work with the static defaults.
 * This script only touches the two new countries' data — everything else
 * in your database is left completely untouched.
 *
 * USAGE
 * -----
 *   npx tsx scripts/sync-new-countries.ts
 *
 * Requires the same .env.local as `npm run seed` (NEXT_PUBLIC_SUPABASE_URL
 * + SUPABASE_SERVICE_ROLE_KEY).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase/admin";
import { countries } from "../src/data/countries";
import { universities } from "../src/data/universities";
import { faqs } from "../src/data/faqs";

const TARGET_COUNTRY_SLUGS = ["gurcustan", "qazaxistan"];

async function sync() {
  const supabase = createAdminClient();
  const targetCountries = countries.filter((c) => TARGET_COUNTRY_SLUGS.includes(c.slug));
  const targetUniversities = universities.filter((u) => TARGET_COUNTRY_SLUGS.includes(u.country_slug));
  const targetFaqs = faqs.filter((f) => f.country_slug && TARGET_COUNTRY_SLUGS.includes(f.country_slug));

  console.log(`Syncing ${targetCountries.length} countries: ${targetCountries.map((c) => c.slug).join(", ")}`);
  for (const c of targetCountries) {
    const { error } = await supabase.from("countries").upsert(
      {
        slug: c.slug,
        flag_emoji: c.flag_emoji,
        hero_image_url: c.hero_image_url,
        sort_order: c.sort_order,
        is_active: c.is_active,
        is_featured: c.is_featured,
        name_az: c.name_az,
        name_ru: c.name_ru,
        name_en: c.name_en,
        description_az: c.description_az,
        description_ru: c.description_ru,
        description_en: c.description_en,
        warning_banner_az: c.warning_banner,
        warning_banner_ru: c.warning_banner,
        warning_banner_en: c.warning_banner,
        advantages_az: c.advantages,
        advantages_ru: c.advantages_ru,
        advantages_en: c.advantages_en,
        documents_az: c.documents_required,
        documents_ru: c.documents_required,
        documents_en: c.documents_required,
        steps_az: c.application_steps,
        steps_ru: c.application_steps,
        steps_en: c.application_steps,
        qs_universities: c.quick_stats.universities,
        qs_avg_tuition_usd: c.quick_stats.avg_tuition_usd,
        qs_language: c.quick_stats.language,
        qs_visa_difficulty: c.quick_stats.visa_difficulty,
      },
      { onConflict: "slug" },
    );
    if (error) console.error(`countries ${c.slug}:`, error.message);
    else console.log(`  ✓ ${c.slug} (is_active=${c.is_active})`);
  }

  console.log(`\nSyncing ${targetUniversities.length} universities...`);
  for (const u of targetUniversities) {
    const { error } = await supabase.from("universities").upsert(
      {
        slug: u.slug,
        country_slug: u.country_slug,
        website_url: u.website_url,
        logo_url: u.logo_url,
        hero_image_url: u.hero_image_url,
        is_active: u.is_active,
        is_featured: u.is_featured,
        name_az: u.name_az,
        name_ru: u.name_ru,
        name_en: u.name_en,
        city_az: u.city_az,
        city_ru: u.city_ru,
        city_en: u.city_en,
        highlights_az: u.highlights,
        highlights_ru: u.highlights_ru,
        highlights_en: u.highlights_en,
        notes_az: u.notes,
        notes_ru: u.notes_ru,
        notes_en: u.notes_en,
        campus_info_az: u.campus_info,
        campus_info_ru: u.campus_info_ru,
        campus_info_en: u.campus_info_en,
      },
      { onConflict: "slug" },
    );
    if (error) {
      console.error(`universities ${u.slug}:`, error.message);
      continue;
    }
    console.log(`  ✓ ${u.slug}`);

    // Faculties/fees for these two universities only — safe to fully
    // replace since they belong exclusively to the new countries.
    await supabase.from("faculties").delete().eq("university_slug", u.slug);
    for (const f of u.faculties) {
      const { error: fe } = await supabase.from("faculties").insert({
        university_slug: u.slug,
        name_az: f.name_az,
        name_ru: f.name_ru,
        name_en: f.name_en,
        is_competitive: f.is_competitive,
        duration_years: f.duration_years,
        language: f.language,
        sort_order: f.sort_order,
      });
      if (fe) console.error(`faculties ${u.slug}/${f.name_az}:`, fe.message);
    }

    const { error: feeErr } = await supabase
      .from("university_fees")
      .upsert({ university_slug: u.slug, ...u.fees }, { onConflict: "university_slug" });
    if (feeErr) console.error(`fees ${u.slug}:`, feeErr.message);
  }

  console.log(`\nSyncing ${targetFaqs.length} FAQs...`);
  for (const f of targetFaqs) {
    // FAQs have no natural unique key in the schema, so guard against
    // duplicates on repeat runs by matching on country_slug + question.
    const { data: existing } = await supabase
      .from("faqs")
      .select("id")
      .eq("country_slug", f.country_slug!)
      .eq("question_az", f.question_az)
      .maybeSingle();
    const payload = {
      country_slug: f.country_slug ?? null,
      university_slug: f.university_slug ?? null,
      question_az: f.question_az,
      question_ru: f.question_ru,
      question_en: f.question_en,
      answer_az: f.answer_az,
      answer_ru: f.answer_ru,
      answer_en: f.answer_en,
      sort_order: f.sort_order,
    };
    const { error } = existing
      ? await supabase.from("faqs").update(payload).eq("id", existing.id)
      : await supabase.from("faqs").insert(payload);
    if (error) console.error("faqs:", error.message);
    else console.log(`  ✓ ${f.question_az.slice(0, 40)}...`);
  }

  console.log("\nDone! Gürcüstan and Qazaxıstan should now appear on the live site.");
  console.log("If they still don't show up, double-check in Admin → Ölkələr that both are marked 'Aktiv'.");
}

sync().catch((e) => {
  console.error(e);
  process.exit(1);
});
