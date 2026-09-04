import { z } from "zod";

/** UGC sual — public form üçün minimal, sərt validasiya (spam-ə qarşı). */
export const commentSchema = z.object({
  article_slug: z.string().min(1).max(200),
  author_name: z
    .string()
    .trim()
    .min(2, "Ad minimum 2 simvol olmalıdır")
    .max(60, "Ad maksimum 60 simvol ola bilər"),
  question: z
    .string()
    .trim()
    .min(10, "Sual minimum 10 simvol olmalıdır")
    .max(1000, "Sual maksimum 1000 simvol ola bilər"),
});

export type CommentInput = z.infer<typeof commentSchema>;
