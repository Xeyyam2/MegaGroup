import Link from "next/link";
import {
  countryComparison,
  comparisonHeaders,
  countryComparisonUrl,
} from "@/data/country-comparison";

/**
 * 7 ölkənin yan-yana müqayisə cədvəli — machine-readable HTML `<table>`.
 *
 * GEO/AEO üçün kritik: AI-lar cədvəl/siya formatını asan çıxarış üçün üstün
 * tutur. Bu komponent ana səhifə (AZ) və istənildikdə digər səhifələrdə
 * istifadə olunur. Ölkə adları müvafiq ölkə səhifəsinə linkdir (daxili
 * link gücü + istifadəçi üçün kliklənə bilən).
 */
export function CountryComparisonTable() {
  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <caption className="sr-only">
          Türkiyə, Rusiya, Gürcüstan, Ukrayna, Qazaxıstan, Almaniya və Polşa üzrə
          xaricdə təhsil müqayisəsi — təhsil haqqı, yaşayış xərcləri, dil, qəbul,
          viza və diplom tanınması.
        </caption>
        <thead>
          <tr className="border-b border-white/15 text-left">
            {comparisonHeaders.map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-3 font-heading text-xs font-bold uppercase tracking-wide text-foreground/70"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {countryComparison.map((row) => (
            <tr key={row.countrySlug} className="border-b border-white/5 last:border-0">
              <th
                scope="row"
                className="px-4 py-3 text-left font-semibold text-foreground"
              >
                <Link
                  href={`/az/xaricde-tehsil/${row.countrySlug}`}
                  className="text-brand-primary hover:underline"
                >
                  {row.country}
                </Link>
              </th>
              <td className="px-4 py-3 text-foreground/80">{row.tuition}</td>
              <td className="px-4 py-3 text-foreground/80">{row.living}</td>
              <td className="px-4 py-3 text-foreground/80">{row.language}</td>
              <td className="px-4 py-3 text-foreground/80">{row.admission}</td>
              <td className="px-4 py-3 text-foreground/80">{row.visa}</td>
              <td className="px-4 py-3 text-foreground/80">{row.recognition}</td>
              <td className="px-4 py-3 text-foreground/80">{row.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-3 text-xs text-foreground/50">
        Rəqəmlər orta göstəricilərdir — universitet, şəhər və ixtisasdan asılı
        olaraq dəyişir.{" "}
        <Link href="/az/bloq/hansi-olkede-oxumaq-serfelidir" className="text-brand-primary hover:underline">
          Tam müqayisə bələdçisini oxu →
        </Link>
        <span className="sr-only"> {countryComparisonUrl}</span>
      </p>
    </div>
  );
}
