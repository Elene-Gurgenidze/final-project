
const API_URL = import.meta.env.VITE_API_URL

export async function uploadImage(file) {
  if (!API_URL) {
    throw new Error('VITE_API_URL is missing in Frontend .env')
  }

  const signRes = await fetch(`${API_URL}/api/uploads/sign`, {
    method: 'POST',
  })

  const signData = await signRes.json().catch(() => ({}))

  if (!signRes.ok) {
    throw new Error(
      signData.message || `Signature request failed: ${signRes.status}`
    )
  }

  const { cloudName, apiKey, timestamp, folder, signature } = signData

  const body = new FormData()
  body.append('file', file)
  body.append('api_key', apiKey)
  body.append('timestamp', timestamp)
  body.append('folder', folder)
  body.append('signature', signature)

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body,
    }
  )

  const uploadData = await uploadRes.json()

  if (!uploadRes.ok) {
    throw new Error(uploadData.error?.message || 'Cloudinary upload failed')
  }

  return {
    url: uploadData.secure_url,
    publicId: uploadData.public_id,
  }
}
