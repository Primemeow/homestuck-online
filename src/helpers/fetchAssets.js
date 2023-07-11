import { ASSET_BASE_URL, MSPA_JSON_URL } from '../constants/url'

export async function fetchMSPAJson() {
  const response = await fetch(MSPA_JSON_URL)
  const data = await response.json()
  return data
}

// prefetches images before load for a smoother experience, but they are blobs, not real images
export async function fetchImageAssets(media) {
  const assets = await Promise.all(
    media.map((asset) => fetch(`${ASSET_BASE_URL}${asset}`).then((res) => res.blob())),
  )
  return assets.map((blob) => URL.createObjectURL(blob))
}

// if we want to keep regular .gif files instead of blobs...
// export function fetchImageAssets(media) {
//   const assets = media.map(asset => `${ASSET_BASE_URL}${asset}`);
//   return assets;
// }