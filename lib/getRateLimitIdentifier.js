import { headers } from "next/headers"

export async function getIdentifier() {
    // Use IP address as identifier
    const h = await headers()

    const ip =
        h.get("x-real-ip") ??
        h.get("x-forwarded-for")?.split(",")[0].trim() ??
        "127.0.0.1"

    return ip
}