import { z } from "zod"

export const productSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be under 100 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must be under 1000 characters"),

    price: z
        .string()
        .refine((val) => /^\d+(\.\d+)?$/.test(val), {
            message: "Price must be a valid number",
        })
        .transform((val) => parseFloat(val))
        .refine((val) => val >= 0 && val <= 9999, {
            message: "Price must be between 0 and 9999",
        }),

    coverImageUrl: z
        .string()
        .min(1, "Cover image is required"),

    fileKey: z
        .string()
        .min(1, "Product file is required"),
})