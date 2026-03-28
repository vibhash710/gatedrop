"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema } from "@/lib/validations/product.validation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadButton } from "@uploadthing/react"
import { createProductAction, updateProductAction } from "@/lib/actions/product.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImageIcon, FileIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"

export default function ProductForm({ product }) {
  const router = useRouter()
  const isEditing = !!product

  const [coverImageUrl, setCoverImageUrl] = useState(
    product?.coverImageUrl || ""
  )
  const [fileKey, setFileKey] = useState(product?.fileKey || "")
  const [fileName, setFileName] = useState("")
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [error, setError] = useState("")

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price?.toString() || "",
      coverImageUrl: product?.coverImageUrl || "",
      fileKey: product?.fileKey || "",
    },
  })

  async function onSubmit(data) {
    setError("")
    const result = isEditing
      ? await updateProductAction(product.id, data)
      : await createProductAction(data)

    if (result?.error) {
      setError(result.error)
    }
    // if no error, server action redirects
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Complete UI Kit for Figma"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what buyers will get..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (USD)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    placeholder="9.99"
                    className="pl-7"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image Upload */}
        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {coverImageUrl ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border dark:border-neutral-700">
                      <Image
                        src={coverImageUrl}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageUrl("")
                          field.onChange("")
                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed dark:border-neutral-700 rounded-lg p-6 text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-3">
                        Upload a cover image for your product
                      </p>
                      <UploadButton
                        endpoint="coverImage"
                        onUploadBegin={() => setUploadingCover(true)}
                        onClientUploadComplete={(res) => {
                          const url = res[0].url
                          setCoverImageUrl(url)
                          field.onChange(url)
                          setUploadingCover(false)
                        }}
                        onUploadError={() => {
                          setError("Cover image upload failed")
                          setUploadingCover(false)
                        }}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product File Upload */}
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product File</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {fileKey ? (
                    <div className="flex items-center gap-3 border dark:border-neutral-700 rounded-lg p-4">
                      <FileIcon className="w-8 h-8 text-blue-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {fileName || "Product file uploaded"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Ready for buyers
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFileKey("")
                          setFileName("")
                          field.onChange("")
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed dark:border-neutral-700 rounded-lg p-6 text-center">
                      <FileIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-3">
                        Upload your digital product (PDF, ZIP, video, audio)
                      </p>
                      <UploadButton
                        endpoint="productFile"
                        onUploadBegin={() => setUploadingFile(true)}
                        onClientUploadComplete={(res) => {
                          const key = res[0].key
                          const name = res[0].name
                          setFileKey(key)
                          setFileName(name)
                          field.onChange(key)
                          setUploadingFile(false)
                        }}
                        onUploadError={() => {
                          setError("File upload failed")
                          setUploadingFile(false)
                        }}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              uploadingCover ||
              uploadingFile
            }
            className="flex-1"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? "Saving..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Save Changes" : "Create Product"
            )}
          </Button>
        </div>

      </form>
    </Form>
  )
}