import { z } from "zod";

const isValidDate = (v) => !isNaN(Date.parse(v));

const createEventSchema = z
    .object({
        text: z.string().trim().min(1, "Event text is required"),
        startDate: z
            .string()
            .refine(isValidDate, "startDate must be a valid date"),
        endDate: z
            .string()
            .refine(isValidDate, "endDate must be a valid date"),
    })
    .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
        message: "endDate must be on or after startDate",
        path: ["endDate"],
    });

const updateEventSchema = z
    .object({
        text: z
            .string()
            .trim()
            .min(1, "Event text must not be empty")
            .optional(),
        startDate: z
            .string()
            .refine(isValidDate, "startDate must be a valid date")
            .optional(),
        endDate: z
            .string()
            .refine(isValidDate, "endDate must be a valid date")
            .optional(),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                return new Date(data.endDate) >= new Date(data.startDate);
            }
            return true;
        },
        { message: "endDate must be on or after startDate", path: ["endDate"] }
    );

export { createEventSchema, updateEventSchema };
