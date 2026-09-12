import { createClient } from "@supabase/supabase-js"

const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "member-assets"

function getSupabaseUrl() {
  const configuredUrl = process.env.SUPABASE_URL
  if (!configuredUrl) {
    throw new Error("Missing SUPABASE_URL")
  }

  return configuredUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "")
}

function getStorageClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient(getSupabaseUrl(), serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function uploadDataUrl(dataUrl: string, filePath: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    throw new Error("Invalid image data")
  }

  const [, contentType, encodedData] = match
  const file = Buffer.from(encodedData, "base64")
  const supabase = getStorageClient()
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { contentType, upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}

export function getStoredFileUrl(filePath: string) {
  return `${getSupabaseUrl()}/storage/v1/object/public/${bucketName}/${filePath}`
}

export async function removeStoredFiles(filePaths: string[]) {
  const supabase = getStorageClient()
  const { error } = await supabase.storage.from(bucketName).remove(filePaths)
  if (error) throw error
}