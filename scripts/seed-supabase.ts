import { config } from "dotenv";
config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase/admin";
import { countries } from "../src/data/countries";
import { universities } from "../src/data/universities";
import { faqs } from "../src/data/faqs";
import { testimonials } from "../src/data/testimonials";

// --preserve (default): FAQs and testimonials use upsert (no data loss).
// --force: destructively deletes all FAQs/testimonials before re-inserting.
const PRESERVE = !process.argv.includes("--force");
const SENTINEL_UUID = "00000000-0000-0000-0000-000000000000";

if (!PRESERVE) {
  console.warn("⚠ --force: destructive sync — deleting all FAQs and testimonials before re-inserting.");
} else {
  console.log("Safe mode (--preserve): using upsert, no destructive deletes.");
}

async function seed() {
  const supabase = createAdminClient();

  console.log("Seeding countries...");
  for (const c of countries) {
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
        warning_banner_az: c.warning_banner_az ?? c.warning_banner,
        warning_banner_ru: c.warning_banner_ru ?? c.warning_banner_az ?? c.warning_banner,
        warning_banner_en: c.warning_banner_en ?? c.warning_banner_az ?? c.warning_banner,
        advantages_az: c.advantages_az ?? c.advantages,
        advantages_ru: c.advantages_ru,
        advantages_en: c.advantages_en,
        documents_az: c.documents_required_az ?? c.documents_required,
        documents_ru: c.documents_required_ru ?? c.documents_required,
        documents_en: c.documents_required_en ?? c.documents_required,
        steps_az: c.application_steps_az ?? c.application_steps,
        steps_ru: c.application_steps_ru ?? c.application_steps,
        steps_en: c.application_steps_en ?? c.application_steps,
        qs_universities: c.quick_stats.universities,
        qs_avg_tuition_usd: c.quick_stats.avg_tuition_usd,
        qs_language: c.quick_stats.language,
        qs_visa_difficulty: c.quick_stats.visa_difficulty,
      },
      { onConflict: "slug" },
    );
    if (error) console.error(`countries ${c.slug}:`, error.message);
  }

  console.log("Seeding universities + faculties + fees...");
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
      console.error(`universities ${u.slug}:`, error.message);
      continue;
    }

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

  console.log("Seeding FAQs...");
  if (!PRESERVE) {
    await supabase.from("faqs").delete().neq("id", SENTINEL_UUID);
  }
  for (const f of faqs) {
    const insertData = {
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
    const { error } = PRESERVE
      ? await supabase.from("faqs").upsert(insertData, { onConflict: "question_az" })
      : await supabase.from("faqs").insert(insertData);
    if (error) console.error("faqs:", error.message);
  }

  console.log("Seeding testimonials...");
  if (!PRESERVE) {
    await supabase.from("testimonials").delete().neq("id", SENTINEL_UUID);
  }
  for (const t of testimonials) {
    const insertData = {
      student_name: t.student_name,
      university_slug: t.university_slug || null,
      country_slug: t.country_slug || null,
      photo_url: t.photo_url,
      quote_az: t.quote_az,
      quote_ru: t.quote_ru,
      quote_en: t.quote_en,
      year: t.year,
      is_active: true,
      sort_order: 0,
    };
    const { error } = PRESERVE
      ? await supabase.from("testimonials").upsert(insertData, { onConflict: "student_name" })
      : await supabase.from("testimonials").insert(insertData);
    if (error) console.error("testimonials:", error.message);
  }

  console.log("Seeding site_content...");
  const sc: { key: string; az: string; ru?: string; en?: string }[] = [
    { key: "hero_title", az: "Xaricdə Təhsil — Attestatla, İmtahansız", ru: "Учеба за рубежом — аттестат, без экзаменов", en: "Study Abroad — Certificate, Exam-Free" },
    { key: "hero_subtitle", az: "MegaGroup — Xaricdə Təhsil Mərkəzi", ru: "MegaGroup — Центр обучения за рубежом", en: "MegaGroup — Study Abroad Center" },
    { key: "cta_choose_country", az: "Ölkə Seç", ru: "Выбрать страну", en: "Choose Country" },
    { key: "cta_apply", az: "Müraciət Et", ru: "Подать заявку", en: "Apply Now" },
    { key: "cta_free_consult", az: "Pulsuz Konsultasiya Al", ru: "Бесплатная консультация", en: "Get Free Consultation" },
    { key: "hero_stat_universities", az: "200" },
    { key: "hero_stat_exams", az: "0" },
    { key: "hero_stat_countries", az: "7" },
    { key: "hero_stat_students", az: "1000" },
    { key: "contact_whatsapp", az: "https://wa.me/994519999370" },
    { key: "contact_phone", az: "+994 51 572 35 54" },
    { key: "contact_email", az: "info@megagroup.az" },
    { key: "contact_address", az: "Bakı, Azərbaycan" },
    { key: "contact_instagram", az: "https://www.instagram.com/mega_xaricde_tehsil_merkezi/" },
    { key: "contact_tiktok", az: "https://www.tiktok.com/@mega_xaricde_tehsil_merkezi" },
    { key: "footer_description", az: "Azərbaycanlı tələbələr üçün xaricdə təhsil imkanlarını attestatla, imtahansız təqdim edirik.", ru: "Мы предлагаем азербайджанским студентам обучение за рубежом по аттестату, без экзаменов.", en: "We offer Azerbaijani students study-abroad opportunities by certificate, exam-free." },
  ];
  for (const s of sc) {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: s.key, value_az: s.az, value_ru: s.ru ?? s.az, value_en: s.en ?? s.az }, { onConflict: "key" });
    if (error) console.error(`site_content ${s.key}:`, error.message);
  }

  console.log("Creating admin user...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL!;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD!;
  const ADMIN_APP_METADATA = { role: "admin" };

  const { error: ue } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    app_metadata: ADMIN_APP_METADATA,
  });

  if (ue) {
    if (ue.message.toLowerCase().includes("already")) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase());
      if (existing) {
        const { error: upErr } = await supabase.auth.admin.updateUserById(existing.id, {
          app_metadata: ADMIN_APP_METADATA,
        });
        if (upErr) console.error("Admin role update:", upErr.message);
        else console.log("Admin role set on existing user:", adminEmail);
      } else {
        console.error("Admin user found in error but not in list:", ue.message);
      }
    } else {
      console.error("Admin:", ue.message);
    }
  } else {
    console.log("Admin ready:", adminEmail);
  }

  console.log("Seed complete!");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
