import { createUploadthing } from "uploadthing/next"
import { auth } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  // Cover image uploader
  coverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user?.id) throw new Error("Unauthorized")
      if (session.user.role !== "SELLER") throw new Error("Not a seller")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url }
    }),

  // Product file uploader (any file type)
  productFile: f({
    pdf: { maxFileSize: "64MB" },
    image: { maxFileSize: "64MB" },
    video: { maxFileSize: "512MB" },
    audio: { maxFileSize: "64MB" },
    "application/zip": { maxFileSize: "64MB" },
  })
    .middleware(async () => {
      const session = await auth()
      if (!session?.user?.id) throw new Error("Unauthorized")
      if (session.user.role !== "SELLER") throw new Error("Not a seller")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { key: file.key, url: file.url }
    }),
}