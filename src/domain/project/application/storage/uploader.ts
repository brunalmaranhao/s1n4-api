import { GetObjectCommandOutput } from '@aws-sdk/client-s3'

export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export interface DownloadParams {
  fileName: string
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
  abstract download(
    params: DownloadParams,
  ): Promise<{ file: GetObjectCommandOutput }>
}
