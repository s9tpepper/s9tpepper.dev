import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { checkAuthorization } from '@/actions/users'

const f = createUploadthing()

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const authorization = await checkAuthorization()
      if (!authorization.success) {
        throw new Error('Not authorized to upload')
      }

      return authorization
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return metadata.user
    }),
} satisfies FileRouter

export type SiteFileRouter = typeof fileRouter
