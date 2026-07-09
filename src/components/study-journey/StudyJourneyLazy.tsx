"use client";
import dynamic from "next/dynamic";

// StudyJourneySection three.js + gsap-ı ağır çəkir. Aşağı qatda olduğu üçün
// ilk render-də lazım deyil — ssr:false ilə ayrı chunk-a ayırırıq, ilk yükdən sonra gəlir.
const StudyJourneySection = dynamic(
  () => import("./StudyJourneySection").then((m) => m.StudyJourneySection),
  {
    ssr: false,
    loading: () => <div className="h-[450vh] bg-[#05070B]" aria-hidden />,
  },
);

export function StudyJourneyLazy() {
  return <StudyJourneySection />;
}
