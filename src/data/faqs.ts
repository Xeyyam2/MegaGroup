import type { FAQ } from "@/types";

type RawFaq = {
  id: string;
  country_slug?: string;
  university_slug?: string;
  question_az: string;
  question_ru: string;
  question_en: string;
  answer_az: string;
  answer_ru: string;
  answer_en: string;
};

const rawFaqs: RawFaq[] = [
  {
    id: "f1",
    question_az: "Attestatla xaricə necə qəbul ola bilərəm?",
    question_ru: "Как поступить за рубеж по аттестату?",
    question_en: "How can I get admitted abroad with a certificate?",
    answer_az: "Attestatınızla birbaşa xarici universitetlərə müraciət edə bilərsiniz. MegaGroup sizə uyğun universitet seçir, sənədləri hazırlayır və qəbul prosesini idarə edir.",
    answer_ru: "С аттестатом вы можете напрямую подать заявление в зарубежные университеты. MegaGroup подберёт подходящий университет, подготовит документы и проведёт через весь процесс.",
    answer_en: "With your certificate you can apply directly to foreign universities. MegaGroup selects the right university, prepares documents, and manages the admission process.",
  },
  {
    id: "f2",
    question_az: "DIM imtahanı mütləqdir?",
    question_ru: "Обязателен ли экзамен DIM?",
    question_en: "Is the DIM exam mandatory?",
    answer_az: "Xeyr. Xaricə attestatla qəbul üçün DIM imtahanı tələb olunmur. Bir çox ölkələrdə attestat ortalaması kifayət edir.",
    answer_ru: "Нет. Для поступления за рубеж по аттестату экзамен DIM не требуется. Во многих странах достаточно среднего балла аттестата.",
    answer_en: "No. The DIM exam is not required for certificate-based admission abroad. In many countries, the certificate average is sufficient.",
  },
  {
    id: "f3",
    question_az: "Konsultasiya pulsuzdur?",
    question_ru: "Консультация бесплатная?",
    question_en: "Is the consultation free?",
    answer_az: "Bəli, ilkin konsultasiya tam pulsuzdur. Bizə müraciət edin və sizə uyğun variantları təqdim edək.",
    answer_ru: "Да, первичная консультация полностью бесплатна. Свяжитесь с нами, и мы предложим подходящие варианты.",
    answer_en: "Yes, the initial consultation is completely free. Contact us and we will offer suitable options.",
  },
  {
    id: "f4",
    country_slug: "turkiye",
    question_az: "Türkiyədə təhsil haqqı nə qədərdir?",
    question_ru: "Сколько стоит обучение в Турции?",
    question_en: "How much does it cost to study in Turkey?",
    answer_az: "Universitetdən asılı olaraq illik 1200-3000 USD arasında dəyişir. Dövlət universitetlərində daha aşağıdır.",
    answer_ru: "В зависимости от университета, годовая оплата составляет 1200–3000 USD. В государственных университетах дешевле.",
    answer_en: "Depending on the university, annual tuition ranges from 1200–3000 USD. State universities are cheaper.",
  },
  {
    id: "f5",
    country_slug: "turkiye",
    question_az: "Türkiyə tələbə vizası necə alınır?",
    question_ru: "Как получить студенческую визу в Турцию?",
    question_en: "How to get a Turkish student visa?",
    answer_az: "Qəbul məktubu aldıqdan sonra səfirliyə müraciət edirsiniz. Prosedur adətən 2-4 həftə çəkir.",
    answer_ru: "После получения письма о зачислении вы обращаетесь в посольство. Процедура обычно занимает 2–4 недели.",
    answer_en: "After receiving the acceptance letter, you apply at the embassy. The process usually takes 2–4 weeks.",
  },
  {
    id: "f6",
    university_slug: "giresun-universiteti",
    question_az: "Giresun Universitetində tibb oxumaq mümkündürmü?",
    question_ru: "Можно ли изучать медицину в Университете Гиресун?",
    question_en: "Can I study medicine at Giresun University?",
    answer_az: "Bəli, Giresun Universitetinin Tibb fakültəsi mövcuddur. Attestat ortalaması yüksək olan tələbələr üçün əlçatandır.",
    answer_ru: "Да, в Университете Гиресун есть медицинский факультет. Доступен для студентов с высоким средним баллом аттестата.",
    answer_en: "Yes, Giresun University has a Faculty of Medicine. It is accessible for students with a high certificate average.",
  },
  {
    id: "f7",
    university_slug: "giresun-universiteti",
    question_az: "Giresun şəhəri təhlükəsizdirmi?",
    question_ru: "Безопасен ли город Гиресун?",
    question_en: "Is the city of Giresun safe?",
    answer_az: "Bəli, Giresun sakit və təhlükəsiz bir Karadeniz şəhəridir. Tələbə dostu mühit var.",
    answer_ru: "Да, Гиресун — тихий и безопасный город на побережье Чёрного моря. Дружелюбная среда для студентов.",
    answer_en: "Yes, Giresun is a quiet and safe Black Sea coastal city. There is a student-friendly environment.",
  },
  {
    id: "f8",
    country_slug: "gurcustan",
    question_az: "Gürcüstanda təhsil haqqı nə qədərdir?",
    question_ru: "Сколько стоит обучение в Грузии?",
    question_en: "How much does it cost to study in Georgia?",
    answer_az: "Universitetdən asılı olaraq illik 2000-5500 USD arasında dəyişir. Tibb ixtisasları adətən daha bahadır.",
    answer_ru: "В зависимости от университета, годовая оплата составляет 2000–5500 USD. Медицинские специальности обычно дороже.",
    answer_en: "Depending on the university, annual tuition ranges from 2000–5500 USD. Medical programs are usually more expensive.",
  },
  {
    id: "f9",
    country_slug: "gurcustan",
    question_az: "Gürcüstanda təhsil ingilis dilində keçirilirmi?",
    question_ru: "Проходит ли обучение в Грузии на английском языке?",
    question_en: "Is education in Georgia taught in English?",
    answer_az: "Bəli, əsasən tibb ixtisasları üzrə tam ingilis dilində proqramlar mövcuddur, ayrıca hazırlıq ili də təklif olunur.",
    answer_ru: "Да, особенно по медицинским специальностям есть программы полностью на английском языке, также предлагается подготовительный год.",
    answer_en: "Yes, especially in medical programs there are fully English-taught tracks, and a preparatory year is also offered.",
  },
  {
    id: "f10",
    country_slug: "qazaxistan",
    question_az: "Qazaxıstanda təhsil haqqı nə qədərdir?",
    question_ru: "Сколько стоит обучение в Казахстане?",
    question_en: "How much does it cost to study in Kazakhstan?",
    answer_az: "Universitetdən asılı olaraq illik 2000-6000 USD arasında dəyişir. Nazarbayev Universiteti nisbətən daha bahadır.",
    answer_ru: "В зависимости от университета, годовая оплата составляет 2000–6000 USD. Назарбаев Университет относительно дороже.",
    answer_en: "Depending on the university, annual tuition ranges from 2000–6000 USD. Nazarbayev University is relatively more expensive.",
  },
  {
    id: "f11",
    country_slug: "qazaxistan",
    question_az: "Qazaxıstana səyahət və viza asandırmı?",
    question_ru: "Легко ли путешествовать и получить визу в Казахстан?",
    question_en: "Is travel and the visa process to Kazakhstan easy?",
    answer_az: "Bəli, tələbə vizası prosesi nisbətən sadədir və uçuş vaxtı Bakıdan bir neçə saatdır.",
    answer_ru: "Да, процесс получения студенческой визы относительно прост, а перелёт из Баку занимает несколько часов.",
    answer_en: "Yes, the student visa process is relatively simple, and the flight from Baku takes just a few hours.",
  },
];

export const faqs: FAQ[] = rawFaqs.map((f, i) => ({
  id: f.id,
  question: f.question_az,
  question_az: f.question_az,
  question_ru: f.question_ru,
  question_en: f.question_en,
  answer: f.answer_az,
  answer_az: f.answer_az,
  answer_ru: f.answer_ru,
  answer_en: f.answer_en,
  country_slug: f.country_slug,
  university_slug: f.university_slug,
  sort_order: i,
}));

export function getFAQsByCountry(countrySlug: string): FAQ[] {
  return faqs.filter((f) => f.country_slug === countrySlug || (!f.country_slug && !f.university_slug));
}
export function getFAQsByUniversity(universitySlug: string): FAQ[] {
  return faqs.filter((f) => f.university_slug === universitySlug || (!f.country_slug && !f.university_slug));
}
export function getGeneralFAQs(): FAQ[] {
  return faqs.filter((f) => !f.country_slug && !f.university_slug);
}