import { ASSET_BASE_URL, MSPA_JSON_URL } from '../constants/url'

export async function fetchMSPAJson() {
  const response = await fetch(MSPA_JSON_URL)
  const data = await response.json()
  return data
}

// prefetches images before load for a smoother experience, but they are blobs, not real images
// kind of annoying to wait for images before loading the page too, so disabled
// export async function fetchImageAssets(media) {
//   const assets = await Promise.all(
//     media.map((asset) => fetch(`${ASSET_BASE_URL}${asset}`).then((res) => res.blob())),
//   )
//   const assetBlobs = assets.map((blob) => URL.createObjectURL(blob));
//   return assetBlobs;
// }

export function getExtension(url) {
  // Handle absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
      let urlObj = new URL(url);
      let pathname = urlObj.pathname; // This does not include the query string or hash fragment
      return pathname.slice(pathname.lastIndexOf('.'));
  }
  
  // Handle relative URLs
  else {
      return url.slice(url.lastIndexOf('.'));
  }
}

export function getFilenameWithoutExtension(url) {
  // Handle absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
      let urlObj = new URL(url);
      let pathname = urlObj.pathname;
      let filename = pathname.slice(pathname.lastIndexOf('/') + 1); // Get the filename
      return filename.slice(0, filename.lastIndexOf('.')); // Return everything before the extension
  }
  
  // Handle relative URLs
  else {
      let filename = url.slice(url.lastIndexOf('/') + 1);
      return filename.slice(0, filename.lastIndexOf('.'));
  }
}


// if we want to keep regular .gif files instead of blobs...
export function fetchImageAssets(media) {
  const assets = media.map(asset => `${ASSET_BASE_URL}${asset}`);
  return assets;
}