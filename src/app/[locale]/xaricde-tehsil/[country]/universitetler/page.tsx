import type { Metadata } from "next";
import { getCountryTopic } from "@/data/country-topics";
import { CountryTopicPage } from "@/components/country/CountryTopicPage";
import { countryTopicStaticParams, countryTopicMetadata } from "@/lib/country-topic-route";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  return countryTopicStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}): Promise<Metadata> {
  return countryTopicMetadata("universitetler", params);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const topic = getCountryTopic("universitetler")!;
  return <CountryTopicPage locale={locale as Locale} country={country} topic={topic} />;
}
