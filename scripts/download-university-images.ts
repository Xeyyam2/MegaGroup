/**
 * Universitet hero şəkillərini Unsplash-dən lokal yükləyir.
 * Bu, xarici asılılığı aradan qaldırır və şəkilləri etibarlı edir.
 *
 * İstifadə: npm run download:images
 *
 * Şəkillər public/images/universities/{slug}.jpg fayllarına yazılır.
 * Sonra src/data/universities.ts faylında hero_image_url
 * "/images/universities/{slug}.jpg" ilə əvəz olunur.
 */
import { universities } from "../src/data/universities";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";

const OUT_DIR = join(process.cwd(), "public", "images", "universities");

async function downloadImage(url: string, slug: string): Promise<boolean> {
  const outPath = join(OUT_DIR, `${slug}.jpg`);
  if (existsSync(outPath)) {
    console.log(`  ✓ ${slug}.jpg artıq mövcuddur, ötürülür`);
    return true;
  }
  try {
    console.log(`  ↓ ${slug} yüklənir...`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  ✗ ${slug}: HTTP ${res.status}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(outPath, buffer);
    const sizeKB = Math.round(buffer.length / 1024);
    console.log(`  ✓ ${slug}.jpg (${sizeKB} KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗ ${slug}: ${(err as Error).message}`);
    return false;
  }
}

async function main() {
  console.log(`\n🖼️  ${universities.length} universitet şəkli yüklənir...\n`);

  if (!existsSync(OUT_DIR)) {
    console.error(`Output qovluğu yaradılmadı: ${OUT_DIR}`);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (const uni of universities) {
    if (!uni.hero_image_url) {
      console.log(`  — ${uni.slug}: hero_image_url boş, ötürülür`);
      continue;
    }
    const ok = await downloadImage(uni.hero_image_url, uni.slug);
    if (ok) success++;
    else failed++;
  }

  console.log(`\n✅ ${success} şəkil yükləndi`);
  if (failed > 0) console.log(`❌ ${failed} şəkil yüklənə bilmədi`);
  console.log(`\nYüklənən şəkillər: public/images/universities/`);
  console.log(`Lokal istifadə üçün universities.ts-də hero_image_url`);
  console.log(`dəyərini "/images/universities/{slug}.jpg" ilə əvəz edin.\n`);
}

main().catch(console.error);
