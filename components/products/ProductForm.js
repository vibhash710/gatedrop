"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema } from "@/lib/validations/product.validation"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "@/lib/uploadthing"
import { createProductAction, updateProductAction, deleteUploadedFileAction } from "@/lib/actions/product.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImageIcon, FileIcon, X, Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

// Reusable dropzone component
function CustomDropzone({ onUploadComplete, onUploadError, onUploadBegin, endpoint, accept, icon: Icon, hint }) {
  const [isUploading, setIsUploading] = useState(false)

  const { startUpload } = useUploadThing(endpoint)

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return
    setIsUploading(true)
    onUploadBegin?.()
    try {
      const res = await startUpload(acceptedFiles)
      if (res) {
        onUploadComplete(res)
      }
    } catch (err) {
      onUploadError(err)
    } finally {
      setIsUploading(false)
    }
  }, [startUpload, onUploadComplete, onUploadError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled: isUploading,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
        ${isDragActive
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
          : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
        }
        ${isUploading ? "pointer-events-none opacity-70" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-500">{hint}</p>
            <p className="text-xs text-gray-400">
              {isDragActive ? "Drop it here" : "or drag and drop here"}
            </p>
            <span className="mt-1 inline-block text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md transition-colors">
              Choose File
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default function ProductForm({ product }) {
  const router = useRouter()
  const isEditing = !!product

  const [coverImageUrl, setCoverImageUrl] = useState(product?.coverImageUrl || "")
  const [isUploading, setIsUploading] = useState(false)
  const [fileKey, setFileKey] = useState(product?.fileKey || "")
  const [fileName, setFileName] = useState(product?.fileUrl || "Uploaded file")

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
    const result = isEditing
      ? await updateProductAction(product.id, data)
      : await createProductAction(data)

    if (result?.error) {
      toast.error(result.error)
    }
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
                <Input placeholder="Complete UI Kit for Figma" {...field} />
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
              <FormLabel>Price (INR)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="9999"
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

        {/* Cover Image */}
        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <div>
                  {coverImageUrl ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border dark:border-neutral-700">
                      <Image src={coverImageUrl} alt="Cover" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteUploadedFileAction(coverImageUrl)
                          setCoverImageUrl("")
                          field.onChange("")
                        }}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <CustomDropzone
                      endpoint="coverImage"
                      accept={{ "image/*": [] }}
                      icon={ImageIcon}
                      hint="Upload a cover image for your product"
                      onUploadBegin={() => setIsUploading(true)}
                      onUploadComplete={(res) => {
                        const url = res[0].url
                        setCoverImageUrl(url)
                        field.onChange(url)
                        setIsUploading(false)
                      }}
                      onUploadError={(err) => {
                        toast.error(err?.message || "Cover image upload failed")
                        setIsUploading(false)
                      }}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product File */}
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product File</FormLabel>
              <FormControl>
                <div>
                  {fileKey ? (
                    <div className="flex items-center gap-3 border dark:border-neutral-700 rounded-lg p-4">
                      <FileIcon className="w-8 h-8 text-blue-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {fileName || "Product file uploaded"}
                        </p>
                        <p className="text-xs text-gray-500">Ready for buyers</p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteUploadedFileAction(fileKey)
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
                    <CustomDropzone
                      endpoint="productFile"
                      accept={{
                        "application/pdf": [],
                        "application/zip": [],
                        "video/*": [],
                        "audio/*": [],
                      }}
                      icon={FileIcon}
                      hint="Upload your Digital Product"
                      onUploadBegin={() => setIsUploading(true)}
                      onUploadComplete={(res) => {
                        const key = res[0].key
                        const name = res[0].name
                        setFileKey(key)
                        setFileName(name)
                        field.onChange(key)
                        setIsUploading(false)
                      }}
                      onUploadError={(err) => {
                        toast.error(err?.message || "File upload failed")
                        setIsUploading(false)
                      }}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 border-gray-300 hover:border-gray-400"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isUploading}
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