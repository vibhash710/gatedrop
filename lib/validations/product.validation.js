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

    price: z.coerce.number()
        .min(0, "Price cannot be negative")
        .max(9999, "Price must be under ₹99,999"),

    coverImageUrl: z
        .string()
        .min(1, "Cover image is required"),

    fileKey: z
        .string()
        .min(1, "Product file is required"),
})