import { generateComponents } from '@uploadthing/react'
import type { SiteFileRouter } from '@/app/api/uploadthing/core'

export const { UploadButton, Uploader } = generateComponents<SiteFileRouter>()
