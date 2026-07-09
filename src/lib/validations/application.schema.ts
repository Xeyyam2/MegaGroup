import { z } from "zod";

// Applications status — DB migration (0003) ilə uyğun gəlməlidir.
export const APPLICATION_STATUSES = ["yeni", "goruldu", "qebul_edildi", "imtina"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const applicationStatusSchema = z.enum(APPLICATION_STATUSES);
