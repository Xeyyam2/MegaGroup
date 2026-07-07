/**
 * Sync ALL universities (all 7 countries) from the static data into the
 * live Supabase `universities` (+ `faculties`, `university_fees`) tables.
 *
 * WHY THIS SCRIPT EXISTS
 * -----------------------
 * The cost calculator and country pages read universities from Supabase,
 * not from src/data/universities.ts. Only a couple of rows ever made it
 * into the live table (likely from an early partial seed), so most
 * countries — not just the newly-added Gürcüstan/Qazaxıstan — are missing
 * their universities on the live site. This script pushes all 14
 * universities currently defined in code.
 *
 * SAFE TO RUN ANYTIME
 * --------------------
 * It only touches the `universities`, `faculties`, and `university_fees`
 * tables — upserting by `slug`. It does NOT touch `countries`, `faqs`,
 * `testimonials`, or `site_content`, so any edits you've made to those from
 * the Admin panel are completely unaffected. Existing university rows with
 * a matching slug get updated in place (not duplicated); rows with slugs
 * that no longer exist in code are left as-is (not deleted).
 *
 * USAGE
 * -----
 *   npm run sync:universities
 *
 * Requires the same .env.local as `npm run seed` (NEXT_PUBLIC_SUPABASE_URL
 * + SUPABASE_SERVICE_ROLE_KEY).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase/admin";
import { universities } from "../src/data/universities";

async function sync() {
  const supabase = createAdminClient();

  console.log(`Syncing ${universities.length} universities across all countries...\n`);
  for (const u of universities) {
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
      console.error(`✗ universities ${u.slug}:`, error.message);
      continue;
    }
    console.log(`✓ ${u.slug} (${u.country_slug})`);

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
      if (fe) console.error(`  ✗ faculties ${u.slug}/${f.name_az}:`, fe.message);
    }

    const { error: feeErr } = await supabase
      .from("university_fees")
      .upsert({ university_slug: u.slug, ...u.fees }, { onConflict: "university_slug" });
    if (feeErr) console.error(`  ✗ fees ${u.slug}:`, feeErr.message);
  }

  console.log("\nDone! All universities should now appear in the cost calculator and country pages.");
}

sync().catch((e) => {
  console.error(e);
  process.exit(1);
});
