import { UniversityCard } from "./UniversityCard";
import type { University } from "@/types";

export function UniversityGrid({
  universities,
  localePrefix = "",
}: {
  universities: University[];
  localePrefix?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {universities.map((u) => (
        <UniversityCard key={u.slug} university={u} localePrefix={localePrefix} />
      ))}
    </div>
  );
}
