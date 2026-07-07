import type { Testimonial } from "@/types";

type RawTestimonial = Omit<Testimonial, "quote">;

const rawTestimonials: RawTestimonial[] = [
  {
    id: "t1",
    student_name: "Aytən Hüseynli",
    university_slug: "giresun-universiteti",
    country_slug: "turkiye",
    photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    quote_az: "DIM imtahanı vermedən Giresun Universitetinə qəbul oldum. MegaGroup bütün prosesdə dəstək oldu.",
    quote_ru: "Поступила в Университет Гиресун без экзамена DIM. MegaGroup поддержали на всём пути.",
    quote_en: "I got admitted to Giresun University without the DIM exam. MegaGroup supported me throughout.",
    year: 2024,
  },
  {
    id: "t2",
    student_name: "Orxan Kərimov",
    university_slug: "giresun-universiteti",
    country_slug: "turkiye",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    quote_az: "Tibb fakültəsində oxuyuram. Attestatla qəbul prosesi çox rahat idi.",
    quote_ru: "Учусь на медицинском факультете. Процесс поступления по аттестату был очень простым.",
    quote_en: "I study at the Faculty of Medicine. The certificate-based admission process was very easy.",
    year: 2024,
  },
  {
    id: "t3",
    student_name: "Ləman Əliyeva",
    university_slug: "varşava-tibb-universiteti",
    country_slug: "polsa",
    photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    quote_az: "Polşada ingilis dilində tibb oxuyuram. Avropa diplomu gələcəyim üçün böyük fürsətdir.",
    quote_ru: "Изучаю медицину на английском в Польше. Европейский диплом — большая возможность для будущего.",
    quote_en: "I study medicine in English in Poland. A European diploma is a great opportunity for my future.",
    year: 2023,
  },
  {
    id: "t4",
    student_name: "Rəşad Məmmədov",
    university_slug: "munchen-texniki-universiteti",
    country_slug: "almaniya",
    photo_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
    quote_az: "Almaniyada pulsuz mühəndislik təhsili alıram. Dil hazırlığı çox vacib idi.",
    quote_ru: "Получаю бесплатное инженерное образование в Германии. Подготовка языка была очень важна.",
    quote_en: "I get free engineering education in Germany. Language preparation was very important.",
    year: 2023,
  },
  {
    id: "t5",
    student_name: "Nigar Soltanova",
    university_slug: "kiev-tibb-universiteti",
    country_slug: "ukrayna",
    photo_url: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80",
    quote_az: "Ukraynada təhlükəsiz regionda oxuyuram. MegaGroup doğru universitet seçməyimdə kömək etdi.",
    quote_ru: "Учусь в безопасном регионе Украины. MegaGroup помогли выбрать правильный университет.",
    quote_en: "I study in a safe region of Ukraine. MegaGroup helped me choose the right university.",
    year: 2024,
  },
  {
    id: "t6",
    student_name: "Tural Əhmədov",
    university_slug: "moskva-dovlet-universiteti",
    country_slug: "rusiya",
    photo_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80",
    quote_az: "Rusiyada iqtisadiyyat oxuyuram. Tanış dil və mühit adaptasiyanı asanlaşdırdı.",
    quote_ru: "Изучаю экономику в России. Знакомый язык и среда облегчили адаптацию.",
    quote_en: "I study economics in Russia. The familiar language and environment made adaptation easier.",
    year: 2023,
  },
];

export const testimonials: Testimonial[] = rawTestimonials.map((t) => ({
  ...t,
  quote: t.quote_az,
}));

export function getTestimonialsByCountry(countrySlug: string): Testimonial[] {
  return testimonials.filter((t) => t.country_slug === countrySlug);
}

export function getTestimonialsByUniversity(universitySlug: string): Testimonial[] {
  return testimonials.filter((t) => t.university_slug === universitySlug);
}
