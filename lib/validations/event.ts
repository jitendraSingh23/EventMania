import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(3),
  category: z.enum(["CONFERENCE", "WORKSHOP", "MEETUP", "CONCERT", "EXHIBITION", "SPORTS", "OTHER"]),
  description: z.string().min(20),
  bannerUrl: z.string().default("/placeholder.png"),
  date: z.string(), // Accept date as string in YYYY-MM-DD format
  time: z.string(), // Accept time as string in HH:mm format
  location: z.string().min(5),
  price: z.number().min(0),
  totalSeats: z.number().min(1),
  rules: z.string(),
  externalLinks: z.array(z.object({
    type: z.enum(["YOUTUBE", "TELEGRAM", "WEBSITE", "INSTAGRAM", "TWITTER", "FACEBOOK"]),
    url: z.string().url()
  })).optional()
});

export type EventFormData = z.infer<typeof eventSchema>;
